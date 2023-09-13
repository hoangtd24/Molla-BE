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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entities/Category");
const CategoryResponse_1 = require("../types/CategoryResponse");
let CategoryResolver = exports.CategoryResolver = class CategoryResolver {
    async createCategory(name) {
        try {
            const newCategory = Category_1.Category.create({
                name,
            });
            await newCategory.save();
            return {
                code: 200,
                success: true,
                message: "Created category successfully",
            };
        }
        catch (error) {
            console.log(error.message);
            return {
                code: 500,
                success: false,
                message: error.message,
            };
        }
    }
    async getCategories() {
        const categories = await Category_1.Category.find({});
        return categories;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => CategoryResponse_1.CategoryMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategories", null);
exports.CategoryResolver = CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CategoryResolver);
//# sourceMappingURL=Category.js.map