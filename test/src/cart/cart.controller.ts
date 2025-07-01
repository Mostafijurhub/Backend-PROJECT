import { Controller, Post, Body, Get, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt')) // This ensures that only authenticated users can access the cart routes
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addProductsToCart(
    @Body() products: { productId: number; quantity: number }[], // Explicit typing for the body
    @Req() req: any, // Injecting the request object to access user info from JWT
  ) {
    console.log('User in Request:', req.user);
   const userId = req.user.userId;
 // Extract userId from JWT payload
    const response = await this.cartService.addProductsToCart(userId, products);
    return response;
  }
  @Get('show')
  async showCart(@Req() req: any) {
    console.log('User in Request:', req.user);  // Log the full req.user object
    const userId = req.user.userId;

    console.log('User ID from Request:', userId); 
    const response = await this.cartService.showCart(userId);
    return response;
  }
  

  @Delete('remove/:productId')
  async removeProductFromCart(
    @Param('productId') productId: number, // Explicitly typing the productId from URL param
    @Req() req: any, // Accessing the request object to get user info
  ) {
    console.log('User in Request:', req.user);
    const userId = req.user.id; // Extract userId from JWT payload
    const response = await this.cartService.removeProductFromCart(userId, productId);
    return response;
  }
}
