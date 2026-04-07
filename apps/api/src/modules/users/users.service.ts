import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        buyerProfile: true,
        sellerProfile: true,
        addresses: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { buyerProfile: true, sellerProfile: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        buyerProfile: user.buyerProfile ? { update: { companyName: dto.companyName } } : undefined,
        sellerProfile: user.sellerProfile
          ? {
              update: {
                businessName: dto.businessName,
                description: dto.description,
                organicCertified: dto.organicCertified,
              },
            }
          : undefined,
      },
    });

    return this.getProfile(userId);
  }

  async listUsers() {
    return this.prisma.user.findMany({
      include: { role: true, buyerProfile: true, sellerProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addAddress(userId: string, dto: CreateAddressDto) {
    await this.prisma.address.create({
      data: {
        userId,
        ...dto,
      },
    });
    return this.getProfile(userId);
  }
}
