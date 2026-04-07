import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LogisticsService } from '../logistics/logistics.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto, UpsertProductDto } from './dto';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logisticsService: LogisticsService,
  ) {}

  async getHomepage() {
    const [banners, categories, featured, deals, seasonal, recent] = await Promise.all([
      this.prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.category.findMany({ orderBy: { name: 'asc' } }),
      this.productList({ featured: true }),
      this.productList({ bestDeal: true }),
      this.productList({ seasonal: true }),
      this.prisma.product.findMany({
        where: { deletedAt: null, approvalStatus: 'APPROVED' },
        include: this.productInclude(),
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ]);

    return { banners, categories, featured, deals, seasonal, recent };
  }

  async listProducts(query: ProductQueryDto) {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 12);
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      approvalStatus: 'APPROVED',
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.organic ? { organicCertified: query.organic === 'true' } : {}),
      ...(query.qualityGrade ? { qualityGrade: query.qualityGrade } : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              gte: query.minPrice ? new Prisma.Decimal(query.minPrice) : undefined,
              lte: query.maxPrice ? new Prisma.Decimal(query.maxPrice) : undefined,
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: this.productInclude(),
        orderBy: this.resolveOrder(query.sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    const enriched = await Promise.all(
      items.map(async (product) => ({
        ...product,
        deliverability:
          query.pincode || (query.latitude && query.longitude)
            ? await this.logisticsService.checkDeliverabilityForProduct(product.id, {
                pincode: query.pincode,
                latitude: query.latitude ? Number(query.latitude) : undefined,
                longitude: query.longitude ? Number(query.longitude) : undefined,
              })
            : null,
      })),
    );

    return {
      items: enriched,
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  async getProductBySlug(slug: string, location?: { pincode?: string; latitude?: number; longitude?: number }) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        ...this.productInclude(),
        batches: {
          include: { traceabilityEvents: { orderBy: { eventAt: 'asc' } } },
        },
        reviews: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product || product.approvalStatus !== 'APPROVED') {
      return null;
    }

    const relatedProducts = await this.prisma.product.findMany({
      where: { 
        categoryId: product.categoryId, 
        id: { not: product.id },
        approvalStatus: 'APPROVED',
      },
      include: this.productInclude(),
      take: 4,
    });

    const deliverability = location
      ? await this.logisticsService.checkDeliverabilityForProduct(product.id, location)
      : null;

    return { ...product, relatedProducts, deliverability };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getSearchSuggestions(search: string) {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        approvalStatus: 'APPROVED',
        name: { contains: search, mode: 'insensitive' },
      },
      select: { id: true, name: true, slug: true },
      take: 8,
    });
  }

  async createProduct(userId: string, dto: UpsertProductDto) {
    const seller = await this.prisma.sellerProfile.findUniqueOrThrow({ where: { userId } });
    const slugBase = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.product.create({
      data: {
        sellerProfileId: seller.id,
        categoryId: dto.categoryId,
        name: dto.name,
        slug: `${slugBase}-${Date.now().toString().slice(-6)}`,
        description: dto.description,
        shortDescription: dto.shortDescription,
        unit: dto.unit,
        price: new Prisma.Decimal(dto.price),
        minOrderQuantity: Number(dto.minOrderQuantity),
        inventoryQuantity: Number(dto.inventoryQuantity),
        qualityGrade: dto.qualityGrade,
        originCity: dto.originCity,
        originState: dto.originState,
        harvestDate: dto.harvestDate ? new Date(dto.harvestDate) : undefined,
        images: dto.imageUrl ? { create: [{ url: dto.imageUrl, sortOrder: 1 }] } : undefined,
        inventory: {
          create: {
            availableQuantity: Number(dto.inventoryQuantity),
            reservedQuantity: 0,
            lowStockThreshold: Math.max(5, Math.floor(Number(dto.inventoryQuantity) * 0.1)),
          },
        },
      },
      include: this.productInclude(),
    });
  }

  async updateProduct(userId: string, productId: string, dto: UpsertProductDto) {
    const seller = await this.prisma.sellerProfile.findUniqueOrThrow({ where: { userId } });
    const product = await this.prisma.product.findUniqueOrThrow({ where: { id: productId } });
    if (product.sellerProfileId !== seller.id) {
      throw new UnauthorizedException('Unauthorized product access');
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        shortDescription: dto.shortDescription,
        unit: dto.unit,
        price: new Prisma.Decimal(dto.price),
        minOrderQuantity: Number(dto.minOrderQuantity),
        inventoryQuantity: Number(dto.inventoryQuantity),
        qualityGrade: dto.qualityGrade,
        originCity: dto.originCity,
        originState: dto.originState,
        harvestDate: dto.harvestDate ? new Date(dto.harvestDate) : undefined,
        inventory: {
          upsert: {
            create: {
              availableQuantity: Number(dto.inventoryQuantity),
              reservedQuantity: 0,
              lowStockThreshold: Math.max(5, Math.floor(Number(dto.inventoryQuantity) * 0.1)),
            },
            update: {
              availableQuantity: Number(dto.inventoryQuantity),
            },
          },
        },
      },
      include: this.productInclude(),
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const seller = await this.prisma.sellerProfile.findUniqueOrThrow({ where: { userId } });
    const product = await this.prisma.product.findUniqueOrThrow({ where: { id: productId } });
    if (product.sellerProfileId !== seller.id) {
      throw new UnauthorizedException('Unauthorized product access');
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  }

  private productInclude() {
    return {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      inventory: true,
      seller: {
        include: {
          user: { select: { fullName: true } },
          serviceAreas: true,
        },
      },
      reviews: true,
    } as const;
  }

  private resolveOrder(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'price_asc':
        return [{ price: 'asc' }];
      case 'price_desc':
        return [{ price: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      default:
        return [{ featured: 'desc' }, { createdAt: 'desc' }];
    }
  }

  private productList(flags: { featured?: boolean; bestDeal?: boolean; seasonal?: boolean }) {
    return this.prisma.product.findMany({
      where: { 
        deletedAt: null,
        approvalStatus: 'APPROVED',
        ...flags 
      },
      include: this.productInclude(),
      take: 8,
    });
  }
}
