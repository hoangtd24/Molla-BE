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
exports.DiscountResolver = void 0;
const Discount_1 = require("../entities/Discount");
const DiscountRespone_1 = require("../types/DiscountRespone");
const DiscountInput_1 = require("../types/inputTypes/DiscountInput");
const type_graphql_1 = require("type-graphql");
let DiscountResolver = exports.DiscountResolver = class DiscountResolver {
    async createDiscount({ createdAt, discount_percent, name, quantity_day }) {
        try {
            const newDiscount = Discount_1.Discount.create({
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
        }
        catch (error) {
            console.log(error.message);
            return {
                code: 500,
                success: true,
                message: error.message,
            };
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => DiscountRespone_1.DiscountMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("discountInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DiscountInput_1.DiscountInput]),
    __metadata("design:returntype", Promise)
], DiscountResolver.prototype, "createDiscount", null);
exports.DiscountResolver = DiscountResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], DiscountResolver);
//# sourceMappingURL=Discount.js.map