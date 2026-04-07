import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RoleType } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CatalogService } from './catalog.service';
import { ProductQueryDto, UpsertProductDto } from './dto';

@Controller({ path: '', version: '1' })
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('home')
  home() {
    return this.catalogService.getHomepage();
  }

  @Get('products')
  products(@Query() query: ProductQueryDto) {
    return this.catalogService.listProducts(query);
  }

  @Get('products/:slug')
  product(
    @Param('slug') slug: string,
    @Query('pincode') pincode?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ) {
    return this.catalogService.getProductBySlug(slug, {
      pincode,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    });
  }

  @Get('categories')
  categories() {
    return this.catalogService.getCategories();
  }

  @Get('search/suggestions')
  suggestions(@Query('q') q: string) {
    return this.catalogService.getSearchSuggestions(q ?? '');
  }

  @Post('seller/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SELLER)
  createProduct(@CurrentUser('sub') userId: string, @Body() dto: UpsertProductDto) {
    return this.catalogService.createProduct(userId, dto);
  }

  @Patch('seller/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SELLER)
  updateProduct(@CurrentUser('sub') userId: string, @Param('productId') productId: string, @Body() dto: UpsertProductDto) {
    return this.catalogService.updateProduct(userId, productId, dto);
  }

  @Delete('seller/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SELLER)
  deleteProduct(@CurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.catalogService.deleteProduct(userId, productId);
  }
}
