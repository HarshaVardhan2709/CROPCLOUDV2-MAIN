import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller({ path: 'dashboard', version: '1' })
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('buyer')
  @Roles(RoleType.BUYER)
  @UseGuards(RolesGuard)
  buyer(@CurrentUser('sub') userId: string) {
    return this.dashboardService.buyerDashboard(userId);
  }

  @Get('seller')
  @Roles(RoleType.SELLER)
  @UseGuards(RolesGuard)
  seller(@CurrentUser('sub') userId: string) {
    return this.dashboardService.sellerDashboard(userId);
  }

  @Get('logistics')
  @Roles(RoleType.LOGISTICS, RoleType.ADMIN)
  @UseGuards(RolesGuard)
  logistics() {
    return this.dashboardService.logisticsDashboard();
  }
}
