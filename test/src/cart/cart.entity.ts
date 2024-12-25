import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { CartItem } from './cartitem.entity';
import { User } from '../user/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.carts)
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItems: CartItem[];

  @Column('decimal', { default: 0 })
  totalPrice: number;

  @Column()
  status: string;
}
