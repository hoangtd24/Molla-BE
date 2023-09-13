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
exports.FilterProductResponse = void 0;
const Product_1 = require("../entities/Product");
const type_graphql_1 = require("type-graphql");
let FilterProductResponse = exports.FilterProductResponse = class FilterProductResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FilterProductResponse.prototype, "total", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FilterProductResponse.prototype, "pages", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Product_1.Product]),
    __metadata("design:type", Array)
], FilterProductResponse.prototype, "products", void 0);
exports.FilterProductResponse = FilterProductResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], FilterProductResponse);
//# sourceMappingURL=FilterProductResponse.js.map