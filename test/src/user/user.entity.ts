import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cart } from '../cart/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Cart, cart => cart.user) // Relates to the user property in the Cart entity
  carts: Cart[]; // List of carts associated with this user
}
