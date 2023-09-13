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
exports.PaginatedOrder = void 0;
const Order_1 = require("../entities/Order");
const type_graphql_1 = require("type-graphql");
let PaginatedOrder = exports.PaginatedOrder = class PaginatedOrder {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PaginatedOrder.prototype, "totalCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], PaginatedOrder.prototype, "cursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedOrder.prototype, "hasMore", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Order_1.Order]),
    __metadata("design:type", Array)
], PaginatedOrder.prototype, "paginatedOrders", void 0);
exports.PaginatedOrder = PaginatedOrder = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedOrder);
//# sourceMappingURL=PaginatedOrder.js.map