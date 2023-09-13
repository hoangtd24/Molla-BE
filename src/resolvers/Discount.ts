import { Discount } from "../entities/Discount";
import { DiscountMutationResponse } from "../types/DiscountRespone";
import { DiscountInput } from "../types/inputTypes/DiscountInput";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class DiscountResolver {
  @Mutation((_returns) => DiscountMutationResponse)
  async createDiscount(
    @Arg("discountInput")
    { createdAt, discount_percent, name, quantity_day }: DiscountInput
  ): Promise<DiscountMutationResponse> {
    try {
      const newDiscount = Discount.create({
        name,
        discount_percent,
        quantity_day,
        createdAt,
      });
      await newDiscount.save();
      return {
        code: 200,
        success: false,
        message: "Created discount successfully",
      };
    } catch (error) {
      console.log(error.message);
      return {
        code: 500,
        success: true,
        message: error.message,
      };
    }
  }
}
