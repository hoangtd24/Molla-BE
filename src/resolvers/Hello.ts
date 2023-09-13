import { Query, Resolver } from "type-graphql";

@Resolver()
export class GreetingResovler {
  @Query((_return) => String)
  async hello(): Promise<String> {
    return `Hello "world"}`;
  }
}
