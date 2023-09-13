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
exports.CartResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const __1 = require("..");
const Cart_1 = require("../entities/Cart");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const checkAuth_1 = require("../middleware/checkAuth");
const CartResponse_1 = require("../types/CartResponse");
const CartInput_1 = require("../types/inputTypes/CartInput");
const DelCartsInput_1 = require("../types/inputTypes/DelCartsInput");
let CartResolver = exports.CartResolver = class CartResolver {
    async total(cart) {
        return cart.product.discount
            ? cart.product.price *
                (1 - cart.product.discount.discount_percent / 100) *
                cart.qty
            : cart.product.price * cart.qty;
    }
    async createCart({ productId, quantity }, { user }) {
        try {
            const existingCart = await Cart_1.Cart.findOne({
                where: {
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
                    },
                    createdAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
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
            const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
            const existingProduct = (await Product_1.Product.findOneBy({
                id: productId,
            }));
            const newCart = Cart_1.Cart.create({
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async delCart(cartId) {
        await __1.AppDataSource.createQueryBuilder()
            .delete()
            .from(Cart_1.Cart)
            .where("id = :id", { id: cartId })
            .execute();
        return {
            code: 200,
            success: true,
            message: "cart deleted successfully",
        };
    }
    async getCarts({ user }) {
        try {
            const carts = await Cart_1.Cart.find({
                where: {
                    user: { id: user === null || user === void 0 ? void 0 : user.userId },
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
            }
            else {
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async updateCart(productId, quantity, { user }) {
        try {
            const cart = (await Cart_1.Cart.findOne({
                where: {
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
                    },
                    product: {
                        id: productId,
                    },
                },
                relations: {
                    product: true,
                },
            }));
            cart.qty = quantity;
            cart.save();
            return {
                code: 200,
                success: true,
                message: "Updated cart successfully",
                cart: cart,
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
    async deleteCarts({ cartIds }) {
        await __1.AppDataSource.getRepository(Cart_1.Cart)
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
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => type_graphql_1.Float),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Cart_1.Cart]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "total", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("cartInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CartInput_1.CartInput, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "createCart", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("cartId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "delCart", null);
__decorate([
    (0, type_graphql_1.Query)(() => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "getCarts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Arg)("quantity")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "updateCart", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CartResponse_1.CartResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("delCartsInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DelCartsInput_1.delCartsInput]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "deleteCarts", null);
exports.CartResolver = CartResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => Cart_1.Cart)
], CartResolver);
//# sourceMappingURL=Cart.js.map