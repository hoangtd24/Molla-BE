import { Order } from "../entities/Order";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedOrder {
  @Field()
  totalCount: number;

  @Field()
  cursor: Date;

  @Field()
  hasMore: boolean;

  @Field(() => [Order])
  paginatedOrders: Order[];
}
