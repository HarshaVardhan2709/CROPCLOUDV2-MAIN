import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyPaymentDto } from './dto';

const RazorpayCtor = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly razorpay = new RazorpayCtor({
    key_id: process.env.RAZORPAY_KEY_ID ?? '',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
  });

  constructor(private readonly prisma: PrismaService) {}

  async createPaymentOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const payment = order.payments[0];
    if (!payment || payment.method !== PaymentMethod.RAZORPAY) {
      throw new BadRequestException('Razorpay payment not configured');
    }

    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order.id },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId: dto.orderId, razorpayOrderId: dto.razorpayOrderId },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (signature !== dto.razorpaySignature) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          razorpayPaymentId: dto.razorpayPaymentId,
          razorpaySignature: dto.razorpaySignature,
        },
      }),
      this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: OrderStatus.CONFIRMED },
      }),
    ]);

    return { success: true };
  }
}
