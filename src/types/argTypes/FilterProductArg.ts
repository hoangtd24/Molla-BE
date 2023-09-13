import { ArgsType, Field, Int, registerEnumType } from "type-graphql";

enum SortPrice {
  DESC = "DESC",
  ASC = "ASC",
}

registerEnumType(SortPrice, {
  name: "SortPrice",
  description: "Sort price of product",
});

@ArgsType()
export class FilterProductArg {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int)
  limit: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  sale?: boolean;

  @Field({ nullable: true })
  top?: boolean;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  price?: SortPrice;
}
