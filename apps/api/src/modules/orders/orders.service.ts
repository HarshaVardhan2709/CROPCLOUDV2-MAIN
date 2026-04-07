import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { CartService } from '../cart/cart.service';
import { LogisticsService } from '../logistics/logistics.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly logisticsService: LogisticsService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const preview = await this.previewOrder(userId, dto.addressId);
    const cart = preview.cart;
    const address = preview.address;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: `CC-${Date.now()}`,
        buyerId: userId,
        addressId: address.id,
        subtotal: preview.subtotal,
        platformFee: preview.platformFee,
        deliveryFee: preview.deliveryFee,
        total: preview.total,
        status: dto.paymentMethod === PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PAYMENT_PENDING,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
        estimatedDeliveryAt: dayjs().add(preview.estimatedDays, 'day').toDate(),
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            sellerId: item.product.sellerProfileId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: new Prisma.Decimal(item.product.price).mul(item.quantity),
          })),
        },
        payments: {
          create: {
            status: dto.paymentMethod === PaymentMethod.COD ? PaymentStatus.PAID : PaymentStatus.CREATED,
            method: dto.paymentMethod,
            amount: preview.total,
          },
        },
      },
      include: { items: true, payments: true },
    });

    for (const item of cart.items) {
      await this.prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          availableQuantity: { decrement: item.quantity },
          reservedQuantity: dto.paymentMethod === PaymentMethod.COD ? undefined : { increment: item.quantity },
        },
      });
    }

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  }

  async previewOrder(userId: string, addressId: string) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    let estimatedDays = 2;
    let deliveryFeeValue = 0;
    const itemChecks = [] as Array<{
      productId: string;
      productName: string;
      deliverable: boolean;
      estimatedDays?: number;
      reason?: string;
    }>;

    for (const item of cart.items) {
      const result = await this.logisticsService.checkDeliverabilityForProduct(item.productId, {
        pincode: address.pincode,
        latitude: address.latitude ?? undefined,
        longitude: address.longitude ?? undefined,
      });

      itemChecks.push({
        productId: item.productId,
        productName: item.product.name,
        deliverable: result.deliverable,
        estimatedDays: result.estimatedDays,
        reason: result.reason,
      });

      if (!result.deliverable) {
        throw new BadRequestException(`${item.product.name} is not deliverable to pincode ${address.pincode}`);
      }

      estimatedDays = Math.max(estimatedDays, result.estimatedDays ?? 2);
      deliveryFeeValue += 40 + Math.max(0, item.quantity - 1) * 10;
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum.plus(new Prisma.Decimal(item.product.price).mul(item.quantity)),
      new Prisma.Decimal(0),
    );
    const platformFee = subtotal.mul(new Prisma.Decimal(process.env.PLATFORM_FEE_PERCENT ?? '2.5')).div(100);
    const deliveryFee = new Prisma.Decimal(deliveryFeeValue);
    const total = subtotal.plus(platformFee).plus(deliveryFee);

    return {
      cart,
      address,
      itemChecks,
      estimatedDays,
      subtotal,
      platformFee,
      deliveryFee,
      total,
      pincode: address.pincode,
      deliverable: true,
    };
  }

  async listOrders(userId: string, role: string) {
    if (role === 'SELLER') {
      const seller = await this.prisma.sellerProfile.findUnique({ where: { userId } });
      return this.prisma.order.findMany({
        where: { items: { some: { sellerId: seller?.id } } },
        include: {
          address: true,
          items: { include: { product: true } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        address: true,
        items: { include: { product: { include: { images: true } } } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(userId: string, orderId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        items: {
          include: {
            product: {
              include: {
                batches: {
                  include: { traceabilityEvents: { orderBy: { eventAt: 'asc' } } },
                },
              },
            },
          },
        },
        payments: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (role === 'BUYER' && order.buyerId !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
