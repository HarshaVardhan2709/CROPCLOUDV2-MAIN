import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WishlistItemDto } from './dto';
import { WishlistService } from './wishlist.service';

@Controller({ path: 'wishlist', version: '1' })
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser('sub') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post('items')
  addItem(@CurrentUser('sub') userId: string, @Body() dto: WishlistItemDto) {
    return this.wishlistService.addItem(userId, dto.productId);
  }

  @Delete('items/:productId')
  removeItem(@CurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.removeItem(userId, productId);
  }
}
