import { Field, InputType } from "type-graphql";

@InputType()
export class CartInput {
  @Field()
  productId: number;

  @Field()
  quantity: number;
}
