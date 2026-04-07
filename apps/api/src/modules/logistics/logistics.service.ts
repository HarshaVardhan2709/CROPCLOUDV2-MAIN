import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DeliveryMode } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async geocode(query: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${process.env.NOMINATIM_BASE_URL}/search`, {
        params: { q: query, format: 'jsonv2', limit: 1 },
        headers: { 'User-Agent': 'CropCloud Marketplace' },
      }),
    );
    return response.data?.[0] ?? null;
  }

  async checkDeliverabilityForProduct(
    productId: string,
    input: { pincode?: string; latitude?: number; longitude?: number },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { seller: { include: { serviceAreas: true } } },
    });
    if (!product) {
      return { deliverable: false, reason: 'Product not found' };
    }

    for (const zone of product.seller.serviceAreas) {
      if (zone.mode === DeliveryMode.PINCODE && input.pincode && zone.pincode === input.pincode) {
        return { deliverable: true, estimatedDays: zone.estimatedDays, method: 'pincode' };
      }
      if (
        zone.mode === DeliveryMode.RADIUS &&
        input.latitude !== undefined &&
        input.longitude !== undefined &&
        zone.centerLatitude !== null &&
        zone.centerLongitude !== null &&
        zone.radiusKm !== null
      ) {
        const distance = this.haversine(zone.centerLatitude, zone.centerLongitude, input.latitude, input.longitude);
        if (distance <= zone.radiusKm) {
          return {
            deliverable: true,
            estimatedDays: zone.estimatedDays,
            method: 'radius',
            distanceKm: Number(distance.toFixed(1)),
          };
        }
      }
    }

    return { deliverable: false, reason: 'Seller does not serve this location' };
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }
}
