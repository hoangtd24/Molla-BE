import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { Wishlist } from "../entities/Wishlist";

@ObjectType({ implements: MutationResponse })
export class WishlistResponse extends MutationResponse {
  @Field(() => Wishlist, { nullable: true })
  wishlist?: Wishlist;
}
