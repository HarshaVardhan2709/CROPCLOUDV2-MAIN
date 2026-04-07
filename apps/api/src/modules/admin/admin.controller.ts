import { Body, Controller, Get, Param, Patch, UseGuards, Delete, Query, Post } from '@nestjs/common';
import { RoleType, SellerStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminApprovedGuard } from '../auth/admin-approved.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdminService } from './admin.service';

@Controller({ path: 'admin', version: '1' })
@Roles(RoleType.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 📊 DASHBOARD & STATS

    @UseGuards(JwtAuthGuard, RolesGuard, AdminApprovedGuard)
    @Get('dashboard')
    dashboard() {
      return this.adminService.dashboard();
    }

    // Allow any authenticated user to access login stats
    @UseGuards(JwtAuthGuard)
    @Get('logins')
    getLoginStats() {
      return this.adminService.getLoginStats();
    }

  @UseGuards(JwtAuthGuard, RolesGuard, AdminApprovedGuard)
  @Get('homepage')
  homepage() {
    return this.adminService.homepageContent();
  }

  // 👥 USER MANAGEMENT
  @UseGuards(JwtAuthGuard, RolesGuard, AdminApprovedGuard)
  @Get('users')
  listAllUsers(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.adminService.listAllUsers(parseInt(page), parseInt(limit));
  }

  @Get('users/:userId')
  getUserDetails(@Param('userId') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, AdminApprovedGuard)
  @Patch('users/:userId/status')
  updateUserStatus(@Param('userId') userId: string, @Body('isActive') isActive: boolean) {
    return this.adminService.updateUserStatus(userId, isActive);
  }

  // 🏪 SELLER MANAGEMENT
  @UseGuards(JwtAuthGuard, RolesGuard, AdminApprovedGuard)
  @Get('sellers')
  listAllSellers(@Query('status') status?: SellerStatus) {
    return this.adminService.listAllSellers(status);
  }

  @Get('sellers/:sellerId')
  getSellerDetails(@Param('sellerId') sellerId: string) {
    return this.adminService.getSellerDetails(sellerId);
  }

  @Patch('sellers/:sellerId')
  approveSeller(@Param('sellerId') sellerId: string, @Body('status') status: SellerStatus) {
    return this.adminService.approveSeller(sellerId, status);
  }

  @Delete('sellers/:sellerId')
  suspendSeller(@Param('sellerId') sellerId: string) {
    return this.adminService.suspendSeller(sellerId);
  }

  // 📦 PRODUCT MANAGEMENT
  @Get('products')
  listAllProducts(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.adminService.listAllProducts(parseInt(page), parseInt(limit));
  }

  @Get('products/:productId')
  getProductDetails(@Param('productId') productId: string) {
    return this.adminService.getProductDetails(productId);
  }

  @Delete('products/:productId')
  removeProduct(@Param('productId') productId: string, @Body('reason') reason: string) {
    return this.adminService.removeProduct(productId, reason);
  }

  // ✅ PRODUCT APPROVAL MANAGEMENT
  @Get('products/pending-approval')
  getPendingProductApprovals(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.adminService.getPendingProductApprovals(parseInt(page), parseInt(limit));
  }

  @Patch('products/:productId/approve')
  approveProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.approveProduct(productId, user.sub, reason);
  }

  @Patch('products/:productId/reject')
  rejectProduct(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectProduct(productId, user.sub, reason);
  }

  // 📋 ORDER MANAGEMENT
  @Get('orders')
  listAllOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
  ) {
    return this.adminService.listAllOrders(parseInt(page), parseInt(limit), status);
  }

  @Get('orders/:orderId')
  getOrderDetails(@Param('orderId') orderId: string) {
    return this.adminService.getOrderDetails(orderId);
  }

  // 📈 ANALYTICS
  @Get('analytics/overview')
  getAnalyticsOverview() {
    return this.adminService.getAnalyticsOverview();
  }

  @Get('analytics/sales')
  getSalesAnalytics(@Query('days') days: string = '30') {
    return this.adminService.getSalesAnalytics(parseInt(days));
  }

  // 🔐 ADMIN APPROVAL MANAGEMENT (ONLY PRIMARY ADMIN)
  @Get('my-status')
  getMyAdminStatus(@CurrentUser() user: any) {
    return this.adminService.getAdminStatus(user.sub);
  }

  @Get('approvals/pending')
  getPendingAdminApprovals(@CurrentUser() user: any) {
    return this.adminService.getPendingAdminApprovals(user.sub);
  }

  @Patch('approvals/:adminId/approve')
  approveAdmin(@CurrentUser() user: any, @Param('adminId') adminId: string) {
    return this.adminService.approveAdminAccount(user.sub, adminId);
  }

  @Patch('approvals/:adminId/reject')
  rejectAdmin(@CurrentUser() user: any, @Param('adminId') adminId: string, @Body('reason') reason?: string) {
    return this.adminService.rejectAdminAccount(user.sub, adminId, reason);
  }

  @Get('all-admins')
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Post('create-admin')
  createAdmin(
    @CurrentUser() user: any,
    @Body()
    createAdminDto: {
      email: string;
      fullName: string;
      password: string;
      phone?: string;
    },
  ) {
    return this.adminService.createNewAdmin(user.sub, createAdminDto);
  }

  // 🚫 USER DISMISSAL (Suspend/Deactivate users)
  @Patch('users/:userId/dismiss')
  dismissUser(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.dismissUser(user.sub, userId, reason);
  }

  @Patch('users/:userId/restore')
  restoreUser(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
  ) {
    return this.adminService.restoreUser(user.sub, userId);
  }
}
