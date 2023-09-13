import { Field, Float, InputType } from "type-graphql";

@InputType()
export class ReviewInput {
  @Field()
  userId: number;

  @Field()
  productId: number;

  @Field()
  content: string;

  @Field(() => Float)
  rating: number;
}
