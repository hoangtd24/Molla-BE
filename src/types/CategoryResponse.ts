import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { Category } from "../entities/Category";

@ObjectType({ implements: MutationResponse })
export class CategoryMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  category?: Category;
}
