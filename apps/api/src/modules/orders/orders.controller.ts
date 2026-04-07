import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderStatus, RoleType } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto, PreviewOrderDto, UpdateOrderStatusDto } from './dto';
import { OrdersService } from './orders.service';

@Controller({ path: 'orders', version: '1' })
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  listOrders(@CurrentUser('sub') userId: string, @CurrentUser('role') role: string) {
    return this.ordersService.listOrders(userId, role);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(userId, dto);
  }

  @Post('preview')
  preview(@CurrentUser('sub') userId: string, @Body() dto: PreviewOrderDto) {
    return this.ordersService.previewOrder(userId, dto.addressId);
  }

  @Get(':orderId')
  getOrder(@CurrentUser('sub') userId: string, @CurrentUser('role') role: string, @Param('orderId') orderId: string) {
    return this.ordersService.getOrder(userId, orderId, role);
  }

  @Patch(':orderId/status')
  @Roles(RoleType.SELLER, RoleType.ADMIN, RoleType.LOGISTICS)
  @UseGuards(RolesGuard)
  updateStatus(@Param('orderId') orderId: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId, dto.status as OrderStatus);
  }
}
