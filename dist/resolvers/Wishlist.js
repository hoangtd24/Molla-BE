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
exports.WishlistResolver = void 0;
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const Wishlist_1 = require("../entities/Wishlist");
const checkAuth_1 = require("../middleware/checkAuth");
const WishlistResponse_1 = require("../types/WishlistResponse");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let WishlistResolver = exports.WishlistResolver = class WishlistResolver extends typeorm_1.BaseEntity {
    async createWishlist(productId, { user }) {
        try {
            const product = (await Product_1.Product.findOneBy({ id: productId }));
            const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
            const newWishlist = Wishlist_1.Wishlist.create({
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async removeWishlist(wishlistId, { user }) {
        try {
            const wishlist = await Wishlist_1.Wishlist.findOne({
                where: {
                    id: wishlistId,
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async removeWishlistByProductId(productId, { user }) {
        try {
            const wishlist = await Wishlist_1.Wishlist.findOne({
                where: {
                    product: {
                        id: productId,
                    },
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async getWishlists({ user }) {
        const wishlists = await Wishlist_1.Wishlist.find({
            where: {
                user: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
            },
            relations: { product: true },
        });
        return wishlists;
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    (0, type_graphql_1.Mutation)(() => WishlistResponse_1.WishlistResponse),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "createWishlist", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    (0, type_graphql_1.Mutation)(() => WishlistResponse_1.WishlistResponse),
    __param(0, (0, type_graphql_1.Arg)("wishlistId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "removeWishlist", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    (0, type_graphql_1.Mutation)(() => WishlistResponse_1.WishlistResponse),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "removeWishlistByProductId", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Wishlist_1.Wishlist]),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "getWishlists", null);
exports.WishlistResolver = WishlistResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WishlistResolver);
//# sourceMappingURL=Wishlist.js.map