import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { CategoryMutationResponse } from "../types/CategoryResponse";

@Resolver()
export class CategoryResolver {
  @Mutation((_returns) => CategoryMutationResponse)
  async createCategory(
    @Arg("name")
    name: string
  ): Promise<CategoryMutationResponse> {
    try {
      const newCategory = Category.create({
        name,
      });
      await newCategory.save();
      return {
        code: 200,
        success: true,
        message: "Created category successfully",
      };
    } catch (error) {
      console.log(error.message);
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Query(() => [Category])
  async getCategories() {
    const categories = await Category.find({});
    return categories;
  }
}
