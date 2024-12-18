import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { AddToCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  
  async addOrUpdateProduct(productId: number, quantity: number = 1): Promise<Cart> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    
    let cartItem = await this.cartRepository.findOne({
      where: { product: { id: productId } },
      relations: ['product'], 
    });

    if (cartItem) {
      
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * product.price;
    } else {
      
      cartItem = this.cartRepository.create({
        product,
        quantity,
        totalPrice: quantity * product.price,
      });
    }


    return this.cartRepository.save(cartItem);
  }

  async getCartItems(): Promise<{ items: Cart[]; totalPrice: number }> {
    const cartItems = await this.cartRepository.find({
      relations: ['product'], 
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return { items: cartItems, totalPrice };
  }

 
  async removeProduct(productId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in the cart');
    }

    await this.cartRepository.remove(cartItem);
  }


  async clearCart(): Promise<void> {
    await this.cartRepository.clear();
  }
}
