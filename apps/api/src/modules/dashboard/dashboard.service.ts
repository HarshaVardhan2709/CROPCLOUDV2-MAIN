import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async buyerDashboard(userId: string) {
    const [orders, wishlist, notifications] = await Promise.all([
      this.prisma.order.findMany({ where: { buyerId: userId }, include: { items: true } }),
      this.prisma.wishlist.findUnique({
        where: { userId },
        include: { items: { include: { product: { include: { images: true } } } } },
      }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);
    const spent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return { orders, wishlist, notifications, spent };
  }

  async sellerDashboard(userId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({ where: { userId } });
    const [products, orders, payouts] = await Promise.all([
      this.prisma.product.findMany({
        where: { sellerProfileId: seller?.id, deletedAt: null },
        include: { inventory: true, images: true },
      }),
      this.prisma.order.findMany({
        where: { items: { some: { sellerId: seller?.id } } },
        include: { items: { include: { product: true } } },
      }),
      this.prisma.sellerPayout.findMany({ where: { sellerProfileId: seller?.id } }),
    ]);
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const lowStock = products.filter(
      (product) =>
        (product.inventory?.availableQuantity ?? 0) <= (product.inventory?.lowStockThreshold ?? 10),
    );
    return { products, orders, payouts, revenue, lowStock };
  }

  async logisticsDashboard() {
    const orders = await this.prisma.order.findMany({
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'READY_FOR_DISPATCH', 'IN_TRANSIT'] } },
      include: { address: true, items: { include: { product: true } } },
    });
    return { orders };
  }
}
