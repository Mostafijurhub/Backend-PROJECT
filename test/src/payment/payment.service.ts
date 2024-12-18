import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepository.create(orderData); 
    return this.orderRepository.save(newOrder); 
  }
  

  async createPaymentIntent(orderId: number): Promise<string> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    
    const paymentIntent = `payment_Code_${Math.random().toString(36).substr(2, 9)}`;

    
    order.paymentIntent = paymentIntent;
    await this.orderRepository.save(order);

    return paymentIntent;
  }
  async confirmPayment(paymentIntentId: string, paymentAmount: number) {
    
    const order = await this.orderRepository.findOne({ where: { paymentIntent: paymentIntentId } });

    if (!order) {
      throw new Error('Order not found for the provided payment intent ID');
    }

  
    console.log('Order Total:', order.totalAmount);
    console.log('Payment Amount:', paymentAmount);

    
    const tolerance = 0.01; 
    if (Math.abs(parseFloat(order.totalAmount.toString()) - parseFloat(paymentAmount.toString())) > tolerance) {
      throw new Error(`Payment amount of ${paymentAmount} doesn't match the order total of ${order.totalAmount}`);
    }

  
    order.status = 'paid';
    await this.orderRepository.save(order);

    return { message: 'Payment confirmed and order marked as paid' };
  }
}
