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
exports.Product = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Category_1 = require("./Category");
const Discount_1 = require("./Discount");
const Review_1 = require("./Review");
let Product = exports.Product = class Product extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)((_type) => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Discount_1.Discount, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => Discount_1.Discount, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Discount_1.Discount)
], Product.prototype, "discount", void 0);
__decorate([
    (0, type_graphql_1.Field)((_type) => [String]),
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Category_1.Category]),
    (0, typeorm_1.ManyToMany)(() => Category_1.Category),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Review_1.Review]),
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (review) => review.product),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: "float", nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "averageRating", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], Product.prototype, "newPrice", void 0);
exports.Product = Product = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Product);
//# sourceMappingURL=Product.js.map