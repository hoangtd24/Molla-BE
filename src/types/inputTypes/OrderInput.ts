import { Field, Float, InputType } from "type-graphql";

@InputType()
export class OrderInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field(() => [Number])
  cartId: number[];

  @Field(() => Float)
  total: number;

  @Field()
  paymentId: number;
}
