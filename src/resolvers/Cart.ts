import {
  Arg,
  Ctx,
  FieldResolver,
  Float,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { IsNull, Not } from "typeorm";
import { AppDataSource } from "..";
import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { checkAuth } from "../middleware/checkAuth";
import { CartResponse } from "../types/CartResponse";
import { Context } from "../types/Context";
import { CartInput } from "../types/inputTypes/CartInput";
import { delCartsInput } from "../types/inputTypes/DelCartsInput";

@Resolver((_of) => Cart)
export class CartResolver {
  @FieldResolver(() => Float)
  async total(@Root() cart: Cart): Promise<number> {
    return cart.product.discount
      ? cart.product.price *
          (1 - cart.product.discount.discount_percent / 100) *
          cart.qty
      : cart.product.price * cart.qty;
  }
  @Mutation(() => CartResponse)
  @UseMiddleware(checkAuth)
  async createCart(
    @Arg("cartInput") { productId, quantity }: CartInput,
    @Ctx() { user }: Context
  ): Promise<CartResponse> {
    try {
      const existingCart = await Cart.findOne({
        where: {
          user: {
            id: user?.userId,
          },
          createdAt: Not(IsNull()),
          product: {
            id: productId,
          },
        },
        relations: {
          user: true,
          product: true,
        },
      });
      if (existingCart) {
        existingCart.qty = existingCart.qty + quantity;
        existingCart.save();
        return {
          code: 200,
          success: true,
          message: "Cart added successfully",
          cart: existingCart,
        };
      }
      const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
      const existingProduct = (await Product.findOneBy({
        id: productId,
      })) as Product;

      const newCart = Cart.create({
        user: existingUser,
        product: existingProduct,
        qty: quantity,
      });
      newCart.save();
      return {
        code: 200,
        success: true,
        message: "Cart added successfully",
        cart: newCart,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => CartResponse)
  @UseMiddleware(checkAuth)
  async delCart(@Arg("cartId") cartId: number): Promise<CartResponse> {
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Cart)
      .where("id = :id", { id: cartId })
      .execute();
    return {
      code: 200,
      success: true,
      message: "cart deleted successfully",
    };
  }

  @Query(() => CartResponse)
  @UseMiddleware(checkAuth)
  async getCarts(@Ctx() { user }: Context): Promise<CartResponse> {
    try {
      const carts = await Cart.find({
        where: {
          user: { id: user?.userId },
        },
        relations: {
          product: {
            discount: true,
          },
          user: true,
        },
        order: {
          createdAt: "DESC",
        },
      });
      let total = 0;
      if (carts.length === 0) {
        total = 0;
      } else {
        total = carts.reduce((total, cart) => {
          return cart.product.discount
            ? total +
                cart.product.price *
                  (1 - cart.product.discount.discount_percent / 100) *
                  cart.qty
            : total + cart.product.price * cart.qty;
        }, 0);
      }
      return {
        code: 200,
        success: true,
        message: "Get carts successfully",
        carts: carts,
        total: total,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => CartResponse)
  @UseMiddleware(checkAuth)
  async updateCart(
    @Arg("productId") productId: number,
    @Arg("quantity") quantity: number,
    @Ctx() { user }: Context
  ): Promise<CartResponse> {
    try {
      const cart = (await Cart.findOne({
        where: {
          user: {
            id: user?.userId,
          },
          product: {
            id: productId,
          },
        },
        relations: {
          product: true,
        },
      })) as Cart;
      cart.qty = quantity;
      cart.save();
      return {
        code: 200,
        success: true,
        message: "Updated cart successfully",
        cart: cart,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => CartResponse)
  @UseMiddleware(checkAuth)
  async deleteCarts(
    @Arg("delCartsInput") { cartIds }: delCartsInput
  ): Promise<CartResponse> {
    await AppDataSource.getRepository(Cart)
      .createQueryBuilder("cart")
      .softDelete()
      .where("cart.id IN (:...cartIds)", { cartIds: cartIds })
      .execute();

    return {
      code: 200,
      success: true,
      message: "delete carts successfully",
    };
  }
}
