import { IsInt, Min } from 'class-validator';

export class CreatePaymentDTO {
  @IsInt()
  @Min(1)
  orderId: number;

  @IsInt()
  @Min(0)
  paymentAmount: number;
}


