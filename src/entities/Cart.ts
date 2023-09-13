import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Product)
  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  qty: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Order, (order) => order.carts)
  @Field()
  order: Order;

  @Field(() => Float)
  total: number;
}
