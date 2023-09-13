import { Field, ObjectType } from "type-graphql";
import { MutationResponse } from "./MutationResponse";
import { User } from "../entities/User";

@ObjectType({ implements: MutationResponse })
export class UserMutationResponse extends MutationResponse {
  @Field({nullable:true})
  user?: User;

  @Field({nullable:true})
  accessToken?: string;
}
