import { Field, Float, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { Cart } from "../entities/Cart";

@ObjectType({ implements: MutationResponse })
export class CartResponse extends MutationResponse {
  @Field({ nullable: true })
  cart?: Cart;

  @Field(() => [Cart], { nullable: true })
  carts?: Cart[];

  @Field(() => Float, { nullable: true })
  total?: number;
}
