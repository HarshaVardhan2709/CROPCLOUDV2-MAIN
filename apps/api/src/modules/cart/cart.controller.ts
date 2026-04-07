import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpsertCartItemDto } from './dto';
import { CartService } from './cart.service';

@Controller({ path: 'cart', version: '1' })
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  addItem(@CurrentUser('sub') userId: string, @Body() dto: UpsertCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Delete('items/:productId')
  removeItem(@CurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.cartService.removeItem(userId, productId);
  }
}
