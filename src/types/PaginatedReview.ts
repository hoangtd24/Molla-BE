import { Review } from "../entities/Review";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedReview {
  @Field()
  totalCount: number;

  @Field()
  cursor: Date;

  @Field()
  hasMore: boolean;

  @Field(() => [Review])
  paginatedReviews: Review[];
}
