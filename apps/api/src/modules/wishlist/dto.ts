import { IsString } from 'class-validator';

export class WishlistItemDto {
  @IsString()
  productId!: string;
}
