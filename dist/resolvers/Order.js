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
exports.OrderResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Cart_1 = require("../entities/Cart");
const Order_1 = require("../entities/Order");
const Payment_1 = require("../entities/Payment");
const User_1 = require("../entities/User");
const checkAuth_1 = require("../middleware/checkAuth");
const OrderResponse_1 = require("../types/OrderResponse");
const OrderInput_1 = require("../types/inputTypes/OrderInput");
const PaginatedOrder_1 = require("../types/PaginatedOrder");
let OrderResolver = exports.OrderResolver = class OrderResolver {
    async createOrder({ address, cartId, email, paymentId, phone, total, username }, { user }) {
        const carts = await Cart_1.Cart.find({
            where: {
                id: (0, typeorm_1.In)(cartId),
            },
            relations: {
                product: true,
            },
        });
        const existingUser = (await User_1.User.findOneBy({ id: user === null || user === void 0 ? void 0 : user.userId }));
        const payment = (await Payment_1.Payment.findOneBy({ id: paymentId }));
        const newOrder = Order_1.Order.create({
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
    async getOrder({ user }, orderId) {
        const existingOrder = await Order_1.Order.findOne({
            where: {
                id: orderId,
                user: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
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
    async orders(cursor, limit, { user }) {
        try {
            const totalCount = await Order_1.Order.findAndCount({
                where: {
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
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
            let lastOrder = totalCount[0][totalCount[1] - 1];
            const findOptions = {
                take: realLimit,
                where: {
                    user: {
                        id: user === null || user === void 0 ? void 0 : user.userId,
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
                findOptions.where = Object.assign(Object.assign({}, findOptions.where), { createdAt: (0, typeorm_1.LessThan)(new Date(cursor)) });
            }
            const orders = await Order_1.Order.find(findOptions);
            return {
                totalCount: totalCount[1],
                cursor: orders[orders.length - 1].createdAt,
                hasMore: cursor
                    ? orders[orders.length - 1].createdAt.toString() !==
                        lastOrder.createdAt.toString()
                    : orders.length !== totalCount[1],
                paginatedOrders: orders,
            };
        }
        catch (error) {
            console.log(error.message);
            return null;
        }
    }
};
__decorate([
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    (0, type_graphql_1.Mutation)(() => OrderResponse_1.OrderResponse),
    __param(0, (0, type_graphql_1.Arg)("orderInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderInput_1.OrderInput, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    (0, type_graphql_1.Query)(() => Order_1.Order, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("orderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrder", null);
__decorate([
    (0, type_graphql_1.Query)((_returns) => PaginatedOrder_1.PaginatedOrder, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Arg)("cursor", { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "orders", null);
exports.OrderResolver = OrderResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], OrderResolver);
//# sourceMappingURL=Order.js.map