import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DeliverabilityDto {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
