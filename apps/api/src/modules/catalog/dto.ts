import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsBooleanString()
  organic?: string;

  @IsOptional()
  @IsString()
  qualityGrade?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumberString()
  latitude?: string;

  @IsOptional()
  @IsNumberString()
  longitude?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;
}

export class UpsertProductDto {
  @IsString()
  name!: string;

  @IsString()
  categoryId!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsString()
  unit!: string;

  @IsNumberString()
  price!: string;

  @IsNumberString()
  minOrderQuantity!: string;

  @IsNumberString()
  inventoryQuantity!: string;

  @IsString()
  qualityGrade!: string;

  @IsOptional()
  @IsString()
  originCity?: string;

  @IsOptional()
  @IsString()
  originState?: string;

  @IsOptional()
  @IsString()
  harvestDate?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
