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
exports.ProductResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const __1 = require("..");
const Category_1 = require("../entities/Category");
const Discount_1 = require("../entities/Discount");
const Product_1 = require("../entities/Product");
const Review_1 = require("../entities/Review");
const FilterProductResponse_1 = require("../types/FilterProductResponse");
const ProductResponse_1 = require("../types/ProductResponse");
const FilterProductArg_1 = require("../types/argTypes/FilterProductArg");
const GetProductArg_1 = require("../types/argTypes/GetProductArg");
const ProductInput_1 = require("../types/inputTypes/ProductInput");
let ProductResolver = exports.ProductResolver = class ProductResolver {
    async averageRating(product) {
        const reviews = await Review_1.Review.find({
            where: {
                product: {
                    id: product.id,
                },
            },
        });
        if (reviews.length === 0) {
            return 0;
        }
        else {
            const totalRating = reviews.reduce((prevValue, currentValue) => prevValue + currentValue.rating, 0);
            product.averageRating = totalRating / reviews.length;
            await product.save();
            return (totalRating / reviews.length).toFixed(1);
        }
    }
    async newPrice(product) {
        if (product.discount) {
            return (product.price *
                (1 - product.discount.discount_percent / 100)).toFixed(2);
        }
        return product.price.toFixed(2);
    }
    async createProduct({ categories, images, name, price, discount }) {
        try {
            const existingCategory = await __1.AppDataSource.getRepository(Category_1.Category)
                .createQueryBuilder("category")
                .where("category.id IN (:...categories)", { categories: categories })
                .getMany();
            let newProduct;
            if (!discount) {
                newProduct = Product_1.Product.create({
                    name,
                    categories: existingCategory,
                    images,
                    price,
                });
            }
            else {
                const existingDiscount = (await Discount_1.Discount.findOneBy({
                    id: discount,
                }));
                newProduct = Product_1.Product.create({
                    name,
                    categories: existingCategory,
                    images,
                    price,
                    discount: existingDiscount,
                });
            }
            await newProduct.save();
            return {
                code: 200,
                success: true,
                message: "created product successfully",
                product: newProduct,
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
    async getProducts({ skip, category, sale }) {
        const findOptions = {
            take: 10,
            relations: {
                discount: true,
            },
        };
        if (skip) {
            findOptions.skip = skip;
        }
        if (category) {
            findOptions.where = {
                categories: {
                    id: category,
                },
            };
        }
        if (sale) {
            findOptions.where = Object.assign(Object.assign({}, findOptions.where), { discount: {
                    id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                } });
        }
        const products = await Product_1.Product.find(findOptions);
        return products;
    }
    async detailProduct(id) {
        try {
            const product = (await Product_1.Product.findOne({
                where: {
                    id: id,
                },
                relations: {
                    discount: true,
                    categories: true,
                    reviews: {
                        user: true,
                        like: true,
                        dislike: true,
                    },
                },
                order: {
                    reviews: {
                        createdAt: "DESC",
                    },
                },
            }));
            const products = await Product_1.Product.find({
                where: {
                    categories: product.categories.map((product) => {
                        return { id: product.id };
                    }),
                },
            });
            console.log("everage rating", product.averageRating);
            return {
                code: 200,
                success: true,
                message: "Get product information successfully",
                product: product,
                relatedProduct: products,
            };
        }
        catch (error) {
            return {
                code: 200,
                success: true,
                message: error.message,
            };
        }
    }
    async getProductsCart(productIds) {
        const products = await Product_1.Product.find({
            where: {
                id: (0, typeorm_1.In)(productIds),
            },
        });
        return products;
    }
    async filter({ category, limit, page, price, search, sale, top }) {
        const whereOptions = {};
        const orderOptions = {};
        if (category) {
            whereOptions.categories = {
                name: (0, typeorm_1.ILike)(`%${category}%`),
            };
        }
        if (search) {
            whereOptions.name = (0, typeorm_1.ILike)(`%${search}%`);
        }
        if (price) {
            orderOptions.price = price;
        }
        if (top) {
            whereOptions.averageRating = (0, typeorm_1.MoreThan)(4);
        }
        if (sale) {
            whereOptions.discount = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
        }
        const products = await Product_1.Product.findAndCount({
            where: whereOptions,
            skip: (page - 1) * limit,
            take: limit,
            order: orderOptions,
            relations: {
                categories: true,
                discount: true,
            },
        });
        return {
            pages: Math.ceil(products[1] / limit),
            products: products[0],
            total: products[1],
        };
    }
    async search({ limit, page, price, search, sale, top }) {
        const whereOptions = {};
        const orderOptions = {};
        if (search) {
            whereOptions.name = (0, typeorm_1.ILike)(`%${search}%`);
        }
        if (price) {
            orderOptions.price = price;
        }
        if (top) {
            whereOptions.averageRating = (0, typeorm_1.MoreThan)(4);
        }
        if (sale) {
            whereOptions.discount = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
        }
        const products = await Product_1.Product.findAndCount({
            where: whereOptions,
            skip: (page - 1) * limit,
            take: limit,
            order: orderOptions,
            relations: {
                categories: true,
                discount: true,
            },
        });
        return {
            pages: Math.ceil(products[1] / limit),
            products: products[0],
            total: products[1],
        };
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "averageRating", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.Product]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "newPrice", null);
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => ProductResponse_1.ProductMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("productInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductInput_1.ProductInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    (0, type_graphql_1.Query)((_returns) => [Product_1.Product]),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetProductArg_1.GetProductArg]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProducts", null);
__decorate([
    (0, type_graphql_1.Query)((_returns) => ProductResponse_1.ProductMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "detailProduct", null);
__decorate([
    (0, type_graphql_1.Query)((_returns) => [Product_1.Product]),
    __param(0, (0, type_graphql_1.Arg)("productIds", () => [Number])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProductsCart", null);
__decorate([
    (0, type_graphql_1.Query)(() => FilterProductResponse_1.FilterProductResponse),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterProductArg_1.FilterProductArg]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "filter", null);
__decorate([
    (0, type_graphql_1.Query)(() => FilterProductResponse_1.FilterProductResponse),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterProductArg_1.FilterProductArg]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "search", null);
exports.ProductResolver = ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => Product_1.Product)
], ProductResolver);
//# sourceMappingURL=Product.js.map