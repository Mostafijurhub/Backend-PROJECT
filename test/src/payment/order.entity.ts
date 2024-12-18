import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column('decimal')
  totalAmount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  paymentIntent: string; 
}
