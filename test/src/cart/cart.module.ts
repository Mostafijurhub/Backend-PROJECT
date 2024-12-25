import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { CartItem } from './cartitem.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, CartItem])], 
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
