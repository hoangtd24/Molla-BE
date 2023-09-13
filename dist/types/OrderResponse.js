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
exports.OrderResponse = void 0;
const Order_1 = require("../entities/Order");
const type_graphql_1 = require("type-graphql");
const MutationResponse_1 = require("./MutationResponse");
let OrderResponse = exports.OrderResponse = class OrderResponse extends MutationResponse_1.MutationResponse {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Order_1.Order)
], OrderResponse.prototype, "order", void 0);
exports.OrderResponse = OrderResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: MutationResponse_1.MutationResponse })
], OrderResponse);
//# sourceMappingURL=OrderResponse.js.map