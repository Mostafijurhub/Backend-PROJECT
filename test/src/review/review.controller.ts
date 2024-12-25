import { Controller, Post, Get, Param, Body, UseGuards,Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'))  
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

 
  @Post('add/:productId')
async addReview(
  @Param('productId') productId: number,
  @Body('comment') comment: string,
  @Body('rating') rating: number,
  @Request() req: any,
) {
  console.log(req.user);  
  const customerId = req.user?.id;
  console.log('Customer ID:', customerId);  
  return this.reviewService.addReview(productId, customerId, comment, rating);
}




  @Get('product/:productId')
  async getReviewsByProduct(@Param('productId') productId: number) {
    const reviews = await this.reviewService.getReviewsByProduct(productId);
    return reviews;
  }
}
