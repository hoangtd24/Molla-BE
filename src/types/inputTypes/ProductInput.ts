import { Field, InputType } from "type-graphql";

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  discount?: number;

  @Field(() => [String])
  images: string[];

  @Field(() => [Number])
  categories: number[];
}
