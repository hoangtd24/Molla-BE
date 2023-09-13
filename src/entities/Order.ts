import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Payment } from "./Payment";
import { User } from "./User";

@Entity()
@ObjectType()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  username: String;

  @Column()
  @Field()
  email: String;

  @Column()
  @Field()
  phone: String;

  @Column()
  @Field()
  address: String;

  @OneToMany(() => Cart, (cart) => cart.order)
  @JoinColumn()
  @Field(() => [Cart])
  carts: Cart[];

  @Column({ type: "float"})
  @Field(() => Float)
  total: number;

  @ManyToOne(() => Payment)
  @JoinColumn()
  @Field(() => Payment)
  payment: Payment;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
