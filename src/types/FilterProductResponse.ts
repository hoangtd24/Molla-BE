import { Product } from "../entities/Product";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FilterProductResponse {
  @Field()
  total: number;

  @Field()
  pages: number;

  @Field(() => [Product])
  products: Product[];
}
