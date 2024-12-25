import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './review.entity';
import { Product } from 'src/cart/product.entity'; 
import { Customer } from './customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product,Customer]),  
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
