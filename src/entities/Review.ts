import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn()
  product: Product;

  @Field()
  @Column()
  content: string;

  @Field(() => Float)
  @Column({ type: "float" })
  rating: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [User], { defaultValue: [] })
  @ManyToMany(() => User)
  @JoinTable()
  like: User[];

  @Field(() => [User], { defaultValue: [] })
  @ManyToMany(() => User)
  @JoinTable()
  dislike: User[];
}
