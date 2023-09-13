import { Order } from "../entities/Order";
import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";

@ObjectType({ implements: MutationResponse })
export class OrderResponse extends MutationResponse {
  @Field({ nullable: true })
  order?: Order;
}
