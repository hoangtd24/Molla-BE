import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { In, LessThan } from "typeorm";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { Payment } from "../entities/Payment";
import { User } from "../entities/User";
import { checkAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { OrderResponse } from "../types/OrderResponse";
import { OrderInput } from "../types/inputTypes/OrderInput";
import { PaginatedOrder } from "../types/PaginatedOrder";

@Resolver()
export class OrderResolver {
  @UseMiddleware(checkAuth)
  @Mutation(() => OrderResponse)
  async createOrder(
    @Arg("orderInput")
    { address, cartId, email, paymentId, phone, total, username }: OrderInput,
    @Ctx() { user }: Context
  ): Promise<OrderResponse> {
    const carts = await Cart.find({
      where: {
        id: In(cartId),
      },
      relations: {
        product: true,
      },
    });
    const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
    const payment = (await Payment.findOneBy({ id: paymentId })) as Payment;
    const newOrder = Order.create({
      username,
      email,
      phone,
      address,
      carts,
      total,
      payment,
      user: existingUser,
    });
    await newOrder.save();
    return {
      code: 200,
      success: true,
      message: "Order created successfully",
      order: newOrder,
    };
  }

  @Query(() => Order, { nullable: true })
  @UseMiddleware(checkAuth)
  async getOrder(
    @Ctx() { user }: Context,
    @Arg("orderId") orderId: number
  ): Promise<Order | null> {
    const existingOrder = await Order.findOne({
      where: {
        id: orderId,
        user: {
          id: user?.userId,
        },
      },
      withDeleted: true,
      relations: {
        carts: {
          product: {
            discount: true,
          },
        },
        payment: true,
      },
    });
    if (!existingOrder) {
      return null;
    }
    return existingOrder;
  }

  @Query((_returns) => PaginatedOrder, { nullable: true })
  @UseMiddleware(checkAuth)
  async orders(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Arg("limit") limit: number,
    @Ctx() { user }: Context
  ): Promise<PaginatedOrder | null> {
    try {
      const totalCount = await Order.findAndCount({
        where: {
          user: {
            id: user?.userId,
          },
        },
        order: {
          createdAt: "DESC",
        },
      });
      if (totalCount[1] === 0) {
        return {
          cursor: new Date(),
          hasMore: false,
          totalCount: 0,
          paginatedOrders: [],
        };
      }
      const realLimit = Math.min(4, limit);

      let lastOrder: Order = totalCount[0][totalCount[1] - 1];
      const findOptions: { [key: string]: any } = {
        take: realLimit,
        where: {
          user: {
            id: user?.userId,
          },
        },
        order: {
          createdAt: "DESC",
        },
        withDeleted: true,
        relations: {
          user: true,
          carts: {
            product: true,
          },
        },
      };

      if (cursor) {
        findOptions.where = {
          ...findOptions.where,
          createdAt: LessThan(new Date(cursor)),
        };
      }
      const orders = await Order.find(findOptions);
      return {
        totalCount: totalCount[1],
        cursor: orders[orders.length - 1].createdAt,
        hasMore: cursor
          ? orders[orders.length - 1].createdAt.toString() !==
            lastOrder.createdAt.toString()
          : orders.length !== totalCount[1],
        paginatedOrders: orders,
      };
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
