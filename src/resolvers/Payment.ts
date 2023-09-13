import { Payment } from "../entities/Payment";
import { PaymentInput } from "../types/inputTypes/PaymentInput";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PaymentResolver {
  @Mutation(() => Payment)
  async createPayment(@Arg("paymentInput") { desc, name }: PaymentInput) {
    const newPayment = Payment.create({
      name,
      desc,
    });
    await newPayment.save();
    return newPayment;
  }

  @Query(() => [Payment])
  async getPayments() {
    const payments = await Payment.find({});
    return payments;
  }
}
