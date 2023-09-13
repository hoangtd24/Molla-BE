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
exports.FilterProductArg = void 0;
const type_graphql_1 = require("type-graphql");
var SortPrice;
(function (SortPrice) {
    SortPrice["DESC"] = "DESC";
    SortPrice["ASC"] = "ASC";
})(SortPrice || (SortPrice = {}));
(0, type_graphql_1.registerEnumType)(SortPrice, {
    name: "SortPrice",
    description: "Sort price of product",
});
let FilterProductArg = exports.FilterProductArg = class FilterProductArg {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { defaultValue: 1 }),
    __metadata("design:type", Number)
], FilterProductArg.prototype, "page", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], FilterProductArg.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FilterProductArg.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], FilterProductArg.prototype, "sale", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], FilterProductArg.prototype, "top", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FilterProductArg.prototype, "search", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FilterProductArg.prototype, "price", void 0);
exports.FilterProductArg = FilterProductArg = __decorate([
    (0, type_graphql_1.ArgsType)()
], FilterProductArg);
//# sourceMappingURL=FilterProductArg.js.map