import { Field, InputType } from "type-graphql";

@InputType()
export class resetPasswordInput {
  @Field()
  userId: string;

  @Field()
  token: string;

  @Field()
  password: string;
}
