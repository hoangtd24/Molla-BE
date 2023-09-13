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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponse = void 0;
const type_graphql_1 = require("type-graphql");
const MutationResponse_1 = require("./MutationResponse");
const Cart_1 = require("../entities/Cart");
let CartResponse = exports.CartResponse = class CartResponse extends MutationResponse_1.MutationResponse {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Cart_1.Cart)
], CartResponse.prototype, "cart", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Cart_1.Cart], { nullable: true }),
    __metadata("design:type", Array)
], CartResponse.prototype, "carts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], CartResponse.prototype, "total", void 0);
exports.CartResponse = CartResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: MutationResponse_1.MutationResponse })
], CartResponse);
//# sourceMappingURL=CartResponse.js.map