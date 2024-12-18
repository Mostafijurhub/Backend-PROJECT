import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './cart.dto'; 

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add/:productId')
  async addToCart(
    @Param('productId') productId: number,
    @Body('quantity') quantity: number = 1,
  ) {
    const cartItem = await this.cartService.addOrUpdateProduct(productId, quantity);
    return {
      message: 'Product added to cart successfully',
      cartItem: {
        id: cartItem.id,
        product: cartItem.product.name,
        quantity: cartItem.quantity,
        totalPrice: cartItem.totalPrice,
      },
    };
  }

  
  @Get()
  async getCartItems() {
    const { items, totalPrice } = await this.cartService.getCartItems();
    return {
      items: items.map(item => ({
        id: item.id,
        product: item.product.name,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalCartPrice: totalPrice,
    };
  }


  @Delete('remove/:productId')
  async removeProduct(@Param('productId') productId: number) {
    await this.cartService.removeProduct(productId);
    return { message: 'Product removed from the cart successfully' };
  }

  @Delete('clear')
  async clearCart() {
    await this.cartService.clearCart();
    return { message: 'Cart cleared successfully' };
  }
}
