import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Product } from 'src/cart/product.entity';
import { Customer } from './customer.entity';
 

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(Customer) 
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async addReview(productId: number, customerId: number, comment: string, rating: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
  
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new Error('Customer not found');
  
    const review = this.reviewRepository.create({
      product,
      customer,
      comment,
      rating,
    });
  
    await this.reviewRepository.save(review);
    return { message: 'Review added successfully' };
  }
  
  async getReviewsByProduct(productId: number) {
   
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'customer'],
    });
  
    
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
    
    return {
      product: reviews[0]?.product?.name, 
      averageRating: isNaN(averageRating) ? 0 : averageRating, 
      reviews: reviews.map((review) => ({
        comment: review.comment,
        rating: review.rating,
        customer: review.customer.email,  
        createdAt: review.createdAt,
      })),
    };
  }
  
}
