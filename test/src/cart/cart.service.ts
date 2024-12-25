import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { CartItem } from './cartitem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  // Add products to the cart
  async addProductsToCart(userId: number, products: { productId: number; quantity: number }[]) {
    // Fetch or create the user's cart by userId and status: 'pending'
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, status: 'pending' },
      relations: ['cartItems', 'cartItems.product'],
    });
  
    // If no cart exists for the user, create a new one for that specific user
    if (!cart) {
      cart = this.cartRepository.create({
        totalPrice: 0,
        status: 'pending',
        user: { id: userId },  // Associate the cart with the user
      });
      await this.cartRepository.save(cart);
    }
  
    let totalPrice = 0;
  
    // Loop through the products and add them to the cart
    for (const productData of products) {
      const product = await this.productRepository.findOne({ where: { id: productData.productId } });
      if (!product) throw new Error(`Product with ID ${productData.productId} not found`);
  
      const existingItem = cart.cartItems.find(item => item.product.id === product.id);
      if (existingItem) {
        // Update the existing cart item quantity and total price
        existingItem.quantity += productData.quantity;
        existingItem.totalPrice = existingItem.quantity * product.price;
      } else {
        // Add new product to the cart
        const cartItem = this.cartItemRepository.create({
          product,
          quantity: productData.quantity,
          totalPrice: product.price * productData.quantity,
          cart,
        });
        cart.cartItems.push(cartItem);
      }
  
      totalPrice += product.price * productData.quantity;
    }
  
    // Update the cart's total price
    cart.totalPrice = totalPrice;
    await this.cartRepository.save(cart);
  
    // Ensure the total price is a valid number and return the response
    const validTotalPrice = isNaN(cart.totalPrice) || cart.totalPrice === null ? 0 : cart.totalPrice;
  
    return { message: 'Products added to cart', totalPrice: validTotalPrice.toFixed(2) };
  }
  
  

  // Show the user's cart (even if empty)
  // Show the user's cart (even if empty)
// Show the user's cart (even if empty)
// Show the user's cart (even if empty)
async showCart(userId: number) {
  console.log(`Fetching cart for user ID: ${userId}`);

 // Ensure user owns the cart before adding products
let cart = await this.cartRepository.findOne({
  where: { user: { id: userId }, status: 'pending' },
  relations: ['cartItems', 'cartItems.product'],
});


  // If no cart exists for the user, create a new one and associate it with the user
  if (!cart) {
    console.log(`No cart found for user ${userId}, creating a new one.`);
    cart = this.cartRepository.create({
      totalPrice: 0,
      status: 'pending',
      user: { id: userId },  // Associate the new cart with the user
    });
    await this.cartRepository.save(cart);  // Save the newly created empty cart
  } else {
    console.log(`Cart found for user ${userId}:`, cart);
  }

  // If no items are in the cart, return a message stating the cart is empty
  if (!cart.cartItems || cart.cartItems.length === 0) {
    console.log(`User ${userId} has no items in their cart.`);
    return { message: 'No products in the cart', totalPrice: '0.00', items: [] };
  }

  // Map the cart items to the desired response format
  const items = cart.cartItems.map(item => ({
    productName: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Ensure the totalPrice is a valid number and format it to 2 decimal places
  const validTotalPrice = isNaN(cart.totalPrice) || cart.totalPrice === null ? 0 : Number(cart.totalPrice);

  return {
    status: cart.status,
    totalPrice: validTotalPrice.toFixed(2),
    items,
  };
}



  // Remove a product from the cart
  async removeProductFromCart(userId: number, productId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, status: 'pending' },  // Ensure cart is for the specific user
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) throw new Error('Cart not found');
    const productIndex = cart.cartItems.findIndex(item => item.product.id === productId);
    if (productIndex === -1) throw new Error('Product not found in cart');

    const productToRemove = cart.cartItems[productIndex];
    cart.cartItems.splice(productIndex, 1);
    cart.totalPrice -= productToRemove.totalPrice;

    await this.cartRepository.save(cart);

    // Ensure totalPrice is a valid number
    const validTotalPrice = isNaN(cart.totalPrice) || cart.totalPrice === null ? 0 : Number(cart.totalPrice);

    return {
      message: `Product with ID ${productId} removed from cart`,
      totalPrice: validTotalPrice.toFixed(2),
      items: cart.cartItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };
  }
}
