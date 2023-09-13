import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { Discount } from "../entities/Discount";

@ObjectType({ implements: MutationResponse })
export class DiscountMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  disount?: Discount;
}
