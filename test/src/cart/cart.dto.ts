import { IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class AddMultipleToCartDto {
  @ValidateNested({ each: true })
  @Type(() => AddToCartDto)
  items: AddToCartDto[];
}
