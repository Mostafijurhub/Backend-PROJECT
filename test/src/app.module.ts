import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Product } from './cart/product.entity';
import { Cart } from './cart/cart.entity';
import { PaymentModule } from './payment/payment.module';
import { Order } from './payment/order.entity';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Bipul', 
      database: 'New',
      entities: [User, Product, Cart, Order], 
      synchronize: true, 
    }),
    UserModule,
    AuthModule,
    CartModule,
    ReviewModule,
    PaymentModule, 
  ],
})
export class AppModule {}
