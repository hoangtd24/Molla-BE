import { Field, InputType } from "type-graphql";

@InputType()
export class delCartsInput {
  @Field(() => [Number])
  cartIds: number[];
}
