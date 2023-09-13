import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class GetProductArg {
  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  category?: number;

  @Field(() => Boolean, { nullable: true })
  sale?: boolean;
}
