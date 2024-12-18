import { Controller, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDTO } from './payment.dto'; 
import { Order } from './order.entity';






@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Post('add-order')
  async addOrder(@Body() orderData: Partial<Order>) {
    return await this.paymentService.createOrder(orderData);
  }


  @Put('create-payment-authentication/:orderId')
  async createPaymentIntent(@Param('orderId') orderId: number): Promise<any> {
    try {
      const paymentIntent = await this.paymentService.createPaymentIntent(orderId);
      return { paymentIntent };
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }
  @Patch('confirm/:paymentIntentId')
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,  
    @Body('paymentAmount') paymentAmount: number,
  ) {
    return this.paymentService.confirmPayment(paymentIntentId, paymentAmount); 
  }
}
