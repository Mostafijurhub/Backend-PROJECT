import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })  
  product: Product;  

  @Column('int')
  quantity: number;

  @Column('decimal')
  totalPrice: number;
}
