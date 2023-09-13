import { Field, InputType } from "type-graphql";

@InputType()
export class PaymentInput {
  @Field()
  name: string;

  @Field()
  desc: string;
}
