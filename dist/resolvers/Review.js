"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Product_1 = require("../entities/Product");
const Review_1 = require("../entities/Review");
const User_1 = require("../entities/User");
const ReviewResponse_1 = require("../types/ReviewResponse");
const ReviewInput_1 = require("../types/inputTypes/ReviewInput");
const checkAuth_1 = require("../middleware/checkAuth");
const PaginatedReview_1 = require("../types/PaginatedReview");
const typeorm_1 = require("typeorm");
let ReviewResolver = exports.ReviewResolver = class ReviewResolver {
    async createReview({ rating, content, productId }, { user }) {
        try {
            const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
            const product = (await Product_1.Product.findOneBy({ id: productId }));
            const newReview = Review_1.Review.create({
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async getReviews(cursor, limit, productId) {
        try {
            const totalCount = await Review_1.Review.find({
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
            let lastReview = [];
            const findOptions = {
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
                    createdAt: (0, typeorm_1.LessThan)(new Date(cursor)),
                };
                lastReview = await Review_1.Review.find({
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
                findOptions.where = Object.assign(Object.assign({}, findOptions.where), { product: {
                        id: productId,
                    } });
            }
            const reviews = await Review_1.Review.find(findOptions);
            return {
                totalCount: totalCount.length,
                cursor: reviews[reviews.length - 1].createdAt,
                hasMore: cursor
                    ? reviews[reviews.length - 1].createdAt.toString() !==
                        lastReview[0].createdAt.toString()
                    : reviews.length !== totalCount.length,
                paginatedReviews: reviews,
            };
        }
        catch (error) {
            console.log(error.message);
            return null;
        }
    }
    async reviewEmotion(reviewId, action, { user }) {
        try {
            const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
            const review = (await Review_1.Review.findOne({
                relations: {
                    like: true,
                    dislike: true,
                    user: true,
                },
                where: {
                    id: reviewId,
                },
            }));
            const liked = review.like.findIndex((userItem) => userItem.id === (user === null || user === void 0 ? void 0 : user.userId));
            const disliked = review.dislike.findIndex((userItem) => userItem.id === (user === null || user === void 0 ? void 0 : user.userId));
            if (action === "like") {
                if (liked === -1) {
                    review.like = [...review.like, existingUser];
                    if (disliked !== -1) {
                        review.dislike.splice(disliked, 1);
                    }
                }
                else {
                    review.like.splice(liked, 1);
                }
            }
            if (action === "dislike") {
                if (disliked === -1) {
                    review.dislike = [...review.dislike, existingUser];
                    if (liked !== -1) {
                        review.like.splice(disliked, 1);
                    }
                }
                else {
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
        }
        catch (error) {
            return error.message;
        }
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    (0, type_graphql_1.Mutation)((_returns) => ReviewResponse_1.ReviewResponse),
    __param(0, (0, type_graphql_1.Arg)("reviewInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewInput_1.ReviewInput, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "createReview", null);
__decorate([
    (0, type_graphql_1.Query)((_returns) => PaginatedReview_1.PaginatedReview, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("cursor", { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __param(2, (0, type_graphql_1.Arg)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "getReviews", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ReviewResponse_1.ReviewResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("reviewId")),
    __param(1, (0, type_graphql_1.Arg)("action")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "reviewEmotion", null);
exports.ReviewResolver = ReviewResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ReviewResolver);
//# sourceMappingURL=Review.js.map