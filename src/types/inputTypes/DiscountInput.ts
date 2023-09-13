import { Field, InputType } from "type-graphql";

@InputType()
export class DiscountInput {
  @Field()
  name: string;

  @Field()
  discount_percent: number;

  @Field()
  createdAt: Date;

  @Field()
  quantity_day: number;
}
