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
exports.PaginatedReview = void 0;
const Review_1 = require("../entities/Review");
const type_graphql_1 = require("type-graphql");
let PaginatedReview = exports.PaginatedReview = class PaginatedReview {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PaginatedReview.prototype, "totalCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], PaginatedReview.prototype, "cursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedReview.prototype, "hasMore", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Review_1.Review]),
    __metadata("design:type", Array)
], PaginatedReview.prototype, "paginatedReviews", void 0);
exports.PaginatedReview = PaginatedReview = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedReview);
//# sourceMappingURL=PaginatedReview%20copy.js.map