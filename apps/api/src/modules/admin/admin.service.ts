import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PaymentStatus, SellerStatus, OrderStatus, ProductApprovalStatus, RoleType } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 📊 DASHBOARD
  async dashboard() {
    const [users, activeSellers, totalOrders, paidPayments, pendingSellers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.sellerProfile.count({ where: { approvalStatus: SellerStatus.APPROVED } }),
      this.prisma.order.count(),
      this.prisma.payment.findMany({ where: { status: PaymentStatus.PAID } }),
      this.prisma.sellerProfile.findMany({
        where: { approvalStatus: SellerStatus.PENDING },
        include: { user: true },
        take: 5,
      }),
    ]);

    const gmv = paidPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    return { users, activeSellers, totalOrders, gmv: gmv / 100, pendingSellers };
  }

  // 📱 LOGIN STATS
  async getLoginStats() {
    const total = await this.prisma.loginLog.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daily = await this.prisma.loginLog.count({
      where: { createdAt: { gte: today } },
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthly = await this.prisma.loginLog.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    return { total, daily, monthly };
  }

  // 📄 HOMEPAGE CONTENT
  async homepageContent() {
    const [banners, categories, products] = await Promise.all([
      this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.category.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.product.findMany({
        include: { images: true, category: true, seller: { include: { user: true } } },
        take: 12,
      }),
    ]);
    return { banners, categories, products };
  }

  // 👥 USER MANAGEMENT
  async listAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { role: true, buyerProfile: true, sellerProfile: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getUserDetails(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        buyerProfile: true,
        sellerProfile: true,
        addresses: true,
        orders: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  // 🏪 SELLER MANAGEMENT
  async listAllSellers(status?: SellerStatus) {
    return this.prisma.sellerProfile.findMany({
      where: status ? { approvalStatus: status } : undefined,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSellerDetails(sellerId: string) {
    return this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
      include: {
        user: { include: { addresses: true } },
        products: { include: { images: true, inventory: true } },
        serviceAreas: true,
      },
    });
  }

  async suspendSeller(sellerId: string) {
    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { approvalStatus: SellerStatus.REJECTED },
    });
  }

  async approveSeller(sellerId: string, status: SellerStatus) {
    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { approvalStatus: status },
    });
  }

  // 📦 PRODUCT MANAGEMENT
  async listAllProducts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        include: { category: true, seller: { include: { user: true } }, images: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getProductDetails(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        seller: { include: { user: true } },
        images: true,
        inventory: true,
        batches: { include: { traceabilityEvents: true } },
      },
    });
  }

  async removeProduct(productId: string, reason: string) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  }

  // 📋 ORDER MANAGEMENT
  async listAllOrders(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        where: status ? { status: status as OrderStatus } : undefined,
        include: {
          buyer: true,
          items: { include: { product: { include: { seller: true } } } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
        where: status ? { status: status as OrderStatus } : undefined,
      }),
    ]);

    return {
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getOrderDetails(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        items: { include: { product: { include: { seller: true } } } },
        payments: true,
        address: true,
      },
    });
  }

  // 📈 ANALYTICS
  async getAnalyticsOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeSellers,
      todayOrders,
      totalOrders,
      todayRevenue,
      totalRevenue,
      pendingSellers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.sellerProfile.count({ where: { approvalStatus: SellerStatus.APPROVED } }),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID, createdAt: { gte: today } },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      this.prisma.sellerProfile.count({ where: { approvalStatus: SellerStatus.PENDING } }),
    ]);

    return {
      totalUsers,
      activeSellers,
      todayOrders,
      totalOrders,
      todayRevenue: (Number(todayRevenue._sum.amount) || 0) / 100,
      totalRevenue: (Number(totalRevenue._sum.amount) || 0) / 100,
      pendingSellers,
    };
  }

  async getSalesAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailySales = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        status: PaymentStatus.PAID,
        createdAt: { gte: startDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    const categoryRevenue = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: startDate },
          payments: { some: { status: PaymentStatus.PAID } },
        },
      },
      _sum: { totalPrice: true },
      _count: true,
    });

    return {
      dailySales: dailySales.map((d) => ({
        date: d.createdAt,
        revenue: (Number(d._sum.amount) || 0) / 100,
        orderCount: d._count,
      })),
      categoryRevenue,
    };
  }

  // 🔐 ADMIN APPROVAL MANAGEMENT
  async getAdminStatus(userId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        isPrimaryAdmin: true,
        adminApprovalStatus: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new Error('Admin user not found');
    }

    return {
      ...admin,
      isApproved: admin.adminApprovalStatus === 'APPROVED',
    };
  }

  async getPendingAdminApprovals(userId: string) {
    // Verify requester is primary admin
    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPrimaryAdmin: true },
    });

    if (!requester?.isPrimaryAdmin) {
      throw new Error('Only the primary admin can approve other admins');
    }

    const pendingAdmins = await this.prisma.user.findMany({
      where: {
        role: { name: 'ADMIN' },
        adminApprovalStatus: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        isPrimaryAdmin: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      count: pendingAdmins.length,
      admins: pendingAdmins,
    };
  }

  async approveAdminAccount(userId: string, adminIdToApprove: string) {
    // Verify requester is primary admin
    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPrimaryAdmin: true },
    });

    if (!requester?.isPrimaryAdmin) {
      throw new Error('Only the primary admin can approve other admins');
    }

    // Can't approve yourself
    if (userId === adminIdToApprove) {
      throw new Error('Cannot approve your own admin account');
    }

    const updatedAdmin = await this.prisma.user.update({
      where: { id: adminIdToApprove },
      data: { adminApprovalStatus: 'APPROVED' },
      select: {
        id: true,
        email: true,
        fullName: true,
        adminApprovalStatus: true,
      },
    });

    return {
      message: `Admin account ${updatedAdmin.email} has been approved`,
      admin: updatedAdmin,
    };
  }

  async rejectAdminAccount(userId: string, adminIdToReject: string, reason?: string) {
    // Verify requester is primary admin
    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isPrimaryAdmin: true },
    });

    if (!requester?.isPrimaryAdmin) {
      throw new Error('Only the primary admin can reject other admins');
    }

    // Can't reject yourself
    if (userId === adminIdToReject) {
      throw new Error('Cannot reject your own admin account');
    }

    const updatedAdmin = await this.prisma.user.update({
      where: { id: adminIdToReject },
      data: { adminApprovalStatus: 'REJECTED' },
      select: {
        id: true,
        email: true,
        fullName: true,
        adminApprovalStatus: true,
      },
    });

    return {
      message: `Admin account ${updatedAdmin.email} has been rejected${reason ? ': ' + reason : ''}`,
      admin: updatedAdmin,
      rejectionReason: reason,
    };
  }

  async getAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: {
        role: { name: 'ADMIN' },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isPrimaryAdmin: true,
        adminApprovalStatus: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: [{ isPrimaryAdmin: 'desc' }, { createdAt: 'asc' }],
    });

    return {
      total: admins.length,
      admins: admins.map((admin) => ({
        ...admin,
        isApproved: admin.adminApprovalStatus === 'APPROVED',
      })),
    };
  }

  async createNewAdmin(
    requesterId: string,
    createAdminDto: {
      email: string;
      fullName: string;
      password: string;
      phone?: string;
    },
  ) {
    // Verify requester is primary admin
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { isPrimaryAdmin: true },
    });

    if (!requester?.isPrimaryAdmin) {
      throw new UnauthorizedException('Only the primary admin can create new admin accounts');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createAdminDto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Validate password strength (at least 8 characters, mix of upper/lower/number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(createAdminDto.password)) {
      throw new UnauthorizedException(
        'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers',
      );
    }

    // Hash the password
    const passwordHash = await argon2.hash(createAdminDto.password);

    // Get ADMIN role
    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      throw new UnauthorizedException('ADMIN role not found in system');
    }

    // Create new admin user with PENDING status
    const newAdmin = await this.prisma.user.create({
      data: {
        email: createAdminDto.email,
        fullName: createAdminDto.fullName,
        phone: createAdminDto.phone,
        passwordHash,
        roleId: adminRole.id,
        isPrimaryAdmin: false,
        adminApprovalStatus: 'PENDING',
        cart: { create: {} },
        wishlist: { create: {} },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isPrimaryAdmin: true,
        adminApprovalStatus: true,
        createdAt: true,
      },
    });

    return {
      message: `Admin account created successfully. Email: ${newAdmin.email}. Status: PENDING approval from primary admin.`,
      admin: newAdmin,
      credentials: {
        email: createAdminDto.email,
        password: '(use the password you provided)',
      },
    };
  }

  // ✅ PRODUCT APPROVAL MANAGEMENT
  async getPendingProductApprovals(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { approvalStatus: ProductApprovalStatus.PENDING },
        skip,
        take: limit,
        include: {
          seller: { include: { user: true } },
          category: true,
          images: { take: 1 },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.product.count({
        where: { approvalStatus: ProductApprovalStatus.PENDING },
      }),
    ]);

    return {
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async approveProduct(productId: string, adminId: string, reason?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.approvalStatus !== ProductApprovalStatus.PENDING) {
      throw new BadRequestException(`Product is already ${product.approvalStatus.toLowerCase()}`);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        approvalStatus: ProductApprovalStatus.APPROVED,
        approvedBy: adminId,
        approvedAt: new Date(),
        approvalReason: reason,
      },
      include: {
        seller: { include: { user: true } },
        category: true,
      },
    });

    return {
      message: `Product "${updatedProduct.name}" has been approved and is now available for sale`,
      product: updatedProduct,
    };
  }

  async rejectProduct(productId: string, adminId: string, reason: string) {
    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.approvalStatus !== ProductApprovalStatus.PENDING) {
      throw new BadRequestException(`Product is already ${product.approvalStatus.toLowerCase()}`);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        approvalStatus: ProductApprovalStatus.REJECTED,
        approvedBy: adminId,
        approvedAt: new Date(),
        approvalReason: reason,
      },
      include: {
        seller: { include: { user: true } },
        category: true,
      },
    });

    return {
      message: `Product "${updatedProduct.name}" has been rejected. Reason: ${reason}`,
      product: updatedProduct,
    };
  }

  // 🚫 USER DISMISSAL (Suspend/Deactivate users)
  async dismissUser(requesterId: string, userId: string, reason: string) {
    if (!reason) {
      throw new BadRequestException('Dismissal reason is required');
    }

    // Can't dismiss yourself
    if (requesterId === userId) {
      throw new BadRequestException('Cannot dismiss your own account');
    }

    // Get the user to be dismissed
    const userToDismiss = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!userToDismiss) {
      throw new BadRequestException('User not found');
    }

    // Get requester details
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      include: { role: true },
    });

    if (!requester) {
      throw new BadRequestException('Requester not found');
    }

    // Only primary admin can dismiss other admins
    if (userToDismiss.role.name === RoleType.ADMIN && !requester.isPrimaryAdmin) {
      throw new UnauthorizedException(
        'Only the primary admin can dismiss other admin accounts. Non-primary admins can only dismiss sellers and buyers.',
      );
    }

    // Perform dismissal
    const dismissedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        dismissedBy: requesterId,
        dismissalReason: reason,
        dismissedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        role: true,
        dismissalReason: true,
        dismissedAt: true,
      },
    });

    return {
      message: `User ${dismissedUser.email} (${dismissedUser.role.name}) has been dismissed. Reason: ${reason}`,
      user: dismissedUser,
    };
  }

  async restoreUser(requesterId: string, userId: string) {
    // Can't restore yourself
    if (requesterId === userId) {
      throw new BadRequestException('Cannot restore your own account');
    }

    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      select: { isPrimaryAdmin: true },
    });

    if (!requester?.isPrimaryAdmin) {
      throw new UnauthorizedException('Only primary admin can restore dismissed users');
    }

    const restoredUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        dismissedBy: null,
        dismissalReason: null,
        dismissedAt: null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        role: true,
      },
    });

    return {
      message: `User ${restoredUser.email} has been restored and is now active`,
      user: restoredUser,
    };
  }
}
