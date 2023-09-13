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
exports.PaymentResolver = void 0;
const Payment_1 = require("../entities/Payment");
const PaymentInput_1 = require("../types/inputTypes/PaymentInput");
const type_graphql_1 = require("type-graphql");
let PaymentResolver = exports.PaymentResolver = class PaymentResolver {
    async createPayment({ desc, name }) {
        const newPayment = Payment_1.Payment.create({
            name,
            desc,
        });
        await newPayment.save();
        return newPayment;
    }
    async getPayments() {
        const payments = await Payment_1.Payment.find({});
        return payments;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Payment_1.Payment),
    __param(0, (0, type_graphql_1.Arg)("paymentInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaymentInput_1.PaymentInput]),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "createPayment", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Payment_1.Payment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentResolver.prototype, "getPayments", null);
exports.PaymentResolver = PaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PaymentResolver);
//# sourceMappingURL=Payment.js.map