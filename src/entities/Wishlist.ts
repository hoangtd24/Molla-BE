import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class Wishlist extends BaseEntity {
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
  @CreateDateColumn()
  createdAt: Date;
}
