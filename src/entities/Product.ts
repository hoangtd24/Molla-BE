import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Discount } from "./Discount";
import { Review } from "./Review";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  price: number;

  @Field(() => Discount, { nullable: true })
  @ManyToOne(() => Discount, { nullable: true })
  @JoinColumn()
  discount: Discount;

  @Field((_type) => [String])
  @Column("text", { array: true })
  images: string[];

  @Field(() => [Category])
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @Field(() => Float)
  @Column({ type: "float", nullable: true })
  averageRating: number;

  @Field(() => Float)
  newPrice: number;
}
