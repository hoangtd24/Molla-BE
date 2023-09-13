import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { Review } from "../entities/Review";

@ObjectType({ implements: MutationResponse })
export class ReviewResponse extends MutationResponse {
  @Field(() => Review, { nullable: true })
  review?: Review;
}
