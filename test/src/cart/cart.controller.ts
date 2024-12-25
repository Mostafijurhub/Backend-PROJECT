import { Controller, Post, Body, Get, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt')) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addProductsToCart(@Body() products: { productId: number; quantity: number }[], @Req() req: any) {
    console.log('User in Request:', req.user); 
    const userId = req.user.id; 
    const response = await this.cartService.addProductsToCart(userId, products);
    return response;
  }
  @Get('show')
  async showCart(@Req() req: any) {
    console.log('User in Request:', req.user);  
    const userId = req.user.id;  
    console.log('User ID from Request:', userId); 
    const response = await this.cartService.showCart(userId);
    return response;
  }
  
  

  @Delete('remove/:productId')
  async removeProductFromCart(@Param('productId') productId: number, @Req() req: any) {
    console.log('User in Request:', req.user); 
    const userId = req.user.id; 
    const response = await this.cartService.removeProductFromCart(userId, productId);
    return response;
  }
}
