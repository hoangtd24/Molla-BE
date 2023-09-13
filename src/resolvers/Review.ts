import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Product } from "../entities/Product";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { ReviewResponse } from "../types/ReviewResponse";
import { ReviewInput } from "../types/inputTypes/ReviewInput";
import { checkAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { PaginatedReview } from "../types/PaginatedReview";
import { LessThan } from "typeorm";

@Resolver()
export class ReviewResolver {
  @UseMiddleware(checkAuth)
  @Mutation((_returns) => ReviewResponse)
  async createReview(
    @Arg("reviewInput") { rating, content, productId }: ReviewInput,
    @Ctx() { user }: Context
  ): Promise<ReviewResponse> {
    try {
      const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
      const product = (await Product.findOneBy({ id: productId })) as Product;
      const newReview = Review.create({
        user: existingUser,
        product,
        content,
        rating,
        like: [],
        dislike: [],
      });
      await newReview.save();

      return {
        code: 200,
        success: true,
        message: "create review successfully",
        review: newReview,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Query((_returns) => PaginatedReview, { nullable: true })
  async getReviews(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Arg("limit") limit: number,
    @Arg("productId") productId: number
  ): Promise<PaginatedReview | null> {
    try {
      const totalCount = await Review.find({
        where: {
          product: {
            id: productId,
          },
        },
      });
      if (totalCount.length === 0) {
        return {
          cursor: new Date(),
          hasMore: false,
          totalCount: 0,
          paginatedReviews: [],
        };
      }
      const realLimit = Math.min(3, limit);

      let lastReview: Review[] = [];
      const findOptions: { [key: string]: any } = {
        take: realLimit,
        order: {
          createdAt: "DESC",
        },
        relations: {
          user: true,
          like: true,
          dislike: true,
        },
      };

      if (cursor) {
        findOptions.where = {
          createdAt: LessThan(new Date(cursor)),
        };
        lastReview = await Review.find({
          where: {
            product: { id: productId },
          },
          order: {
            createdAt: "ASC",
          },
          take: 1,
        });
      }
      if (productId) {
        findOptions.where = {
          ...findOptions.where,
          product: {
            id: productId,
          },
        };
      }
      const reviews = await Review.find(findOptions);
      return {
        totalCount: totalCount.length,
        cursor: reviews[reviews.length - 1].createdAt,
        hasMore: cursor
          ? reviews[reviews.length - 1].createdAt.toString() !==
            lastReview[0].createdAt.toString()
          : reviews.length !== totalCount.length,
        paginatedReviews: reviews,
      };
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Mutation(() => ReviewResponse)
  @UseMiddleware(checkAuth)
  async reviewEmotion(
    @Arg("reviewId") reviewId: number,
    @Arg("action") action: string,
    @Ctx() { user }: Context
  ): Promise<ReviewResponse> {
    try {
      const existingUser = (await User.findOneBy({ id: user?.userId })) as User;
      const review = (await Review.findOne({
        relations: {
          like: true,
          dislike: true,
          user: true,
        },
        where: {
          id: reviewId,
        },
      })) as Review;
      const liked = review.like.findIndex(
        (userItem) => userItem.id === user?.userId
      );
      const disliked = review.dislike.findIndex(
        (userItem) => userItem.id === user?.userId
      );
      if (action === "like") {
        if (liked === -1) {
          review.like = [...review.like, existingUser];
          if (disliked !== -1) {
            review.dislike.splice(disliked, 1);
          }
        } else {
          review.like.splice(liked, 1);
        }
      }
      if (action === "dislike") {
        if (disliked === -1) {
          review.dislike = [...review.dislike, existingUser];
          if (liked !== -1) {
            review.like.splice(disliked, 1);
          }
        } else {
          review.dislike.splice(liked, 1);
        }
      }
      await review.save();
      return {
        code: 200,
        success: true,
        message: "success",
        review: review,
      };
    } catch (error) {
      return error.message;
    }
  }
}
