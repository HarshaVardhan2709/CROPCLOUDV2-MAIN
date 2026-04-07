import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
    const reviews = await this.prisma.review.findMany({
      where: { productId: dto.productId },
      include: { product: true },
    });
    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
    await this.prisma.sellerProfile.update({
      where: { id: reviews[0].product.sellerProfileId },
      data: {
        ratingAverage: average,
        totalRatings: reviews.length,
      },
    });
    return review;
  }
}
