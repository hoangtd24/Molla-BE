import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Wishlist } from "../entities/Wishlist";
import { checkAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { WishlistResponse } from "../types/WishlistResponse";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { BaseEntity } from "typeorm";

@Resolver()
export class WishlistResolver extends BaseEntity {
  @UseMiddleware(checkAuth)
  @Mutation(() => WishlistResponse)
  async createWishlist(
    @Arg("productId") productId: number,
    @Ctx() { user }: Context
  ): Promise<WishlistResponse> {
    try {
      const product = (await Product.findOneBy({ id: productId })) as Product;
      const existingUser = (await User.findOneBy({ id: user?.userId })) as User;

      const newWishlist = Wishlist.create({
        product,
        user: existingUser,
      });
      await newWishlist.save();
      return {
        code: 200,
        success: true,
        message: "created wishlist successfully",
        wishlist: newWishlist,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @UseMiddleware(checkAuth)
  @Mutation(() => WishlistResponse)
  async removeWishlist(
    @Arg("wishlistId") wishlistId: number,
    @Ctx() { user }: Context
  ): Promise<WishlistResponse> {
    try {
      const wishlist = await Wishlist.findOne({
        where: {
          id: wishlistId,
          user: {
            id: user?.userId,
          },
        },
      });
      if (!wishlist) {
        return {
          code: 400,
          success: false,
          message: "wishlist not found",
        };
      }
      await wishlist.remove();
      return {
        code: 200,
        success: true,
        message: "remove wishlist successfully",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @UseMiddleware(checkAuth)
  @Mutation(() => WishlistResponse)
  async removeWishlistByProductId(
    @Arg("productId") productId: number,
    @Ctx() { user }: Context
  ): Promise<WishlistResponse> {
    try {
      const wishlist = await Wishlist.findOne({
        where: {
          product: {
            id: productId,
          },
          user: {
            id: user?.userId,
          },
        },
      });
      if (!wishlist) {
        return {
          code: 400,
          success: false,
          message: "wishlist not found",
        };
      }
      await wishlist.remove();
      return {
        code: 200,
        success: true,
        message: "remove wishlist successfully",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Query(() => [Wishlist])
  @UseMiddleware(checkAuth)
  async getWishlists(@Ctx() { user }: Context): Promise<Wishlist[]> {
    const wishlists = await Wishlist.find({
      where: {
        user: {
          id: user?.userId,
        },
      },
      relations: { product: true },
    });
    return wishlists;
  }
}
