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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const User_1 = require("../entities/User");
const checkAuth_1 = require("../middleware/checkAuth");
const TokenModel_1 = require("../models/TokenModel");
const UserMutationResponse_1 = require("../types/UserMutationResponse");
const LoginInput_1 = require("../types/inputTypes/LoginInput");
const RegisterInput_1 = require("../types/inputTypes/RegisterInput");
const createToken_1 = require("../utils/createToken");
const sendMail_1 = require("../utils/sendMail");
const ResetPasswordInput_1 = require("../types/inputTypes/ResetPasswordInput");
let UserResolver = exports.UserResolver = class UserResolver {
    async register({ email, password, username }) {
        try {
            const existingUser = await User_1.User.findOneBy({ email });
            if (existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: "User already register",
                };
            }
            const hashPassword = await argon2_1.default.hash(password);
            const newUser = User_1.User.create({
                username,
                email,
                password: hashPassword,
            });
            await newUser.save();
            return {
                code: 200,
                success: true,
                message: "Register user successfully",
                user: newUser,
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            };
        }
    }
    async login({ email, password }, { res }) {
        const existingUser = await User_1.User.findOne({
            where: { email },
            relations: {
                cart: {
                    product: true,
                },
            },
        });
        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "Email or password incorrect",
            };
        }
        const verified = await argon2_1.default.verify(existingUser.password, password);
        if (!verified) {
            return {
                code: 400,
                success: false,
                message: "Email or password incorrect",
            };
        }
        (0, createToken_1.sendRefreshToken)(res, existingUser);
        return {
            code: 200,
            success: true,
            message: "Login successfully",
            user: existingUser,
            accessToken: (0, createToken_1.createToken)("accessToken", existingUser),
        };
    }
    async logout({ res }) {
        res.clearCookie(process.env.REFRESH_TOKEN_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/refresh_token",
        });
        return {
            code: 200,
            success: true,
            message: "Logout successfully",
        };
    }
    async me({ user }) {
        try {
            const existingUser = (await User_1.User.findOne({
                where: {
                    id: user === null || user === void 0 ? void 0 : user.userId,
                },
                relations: {
                    cart: {
                        product: true,
                    },
                },
            }));
            return {
                code: 200,
                success: true,
                message: "Load user successfully",
                user: existingUser,
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
    async forgetPassword(email) {
        const existingUser = await User_1.User.findOneBy({ email });
        if (!existingUser) {
            return {
                code: 400,
                success: true,
                message: "User not found",
            };
        }
        await TokenModel_1.TokenModel.findOneAndDelete({ userId: existingUser.id });
        const resetToken = (0, uuid_1.v4)();
        const hashedResetToken = await argon2_1.default.hash(resetToken);
        await TokenModel_1.TokenModel.create({
            userId: existingUser.id,
            token: hashedResetToken,
        });
        await (0, sendMail_1.sendMail)(email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${existingUser.id}">Click here to reset your password</a>`);
        return {
            code: 200,
            success: true,
            message: "Please check your email",
        };
    }
    async resetPassword({ password, token, userId }) {
        try {
            const tokenRecord = await TokenModel_1.TokenModel.findOne({ userId: userId });
            console.log(tokenRecord);
            if (!tokenRecord) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid or expired password reset token",
                };
            }
            const hashTokenRecord = argon2_1.default.verify(tokenRecord.token, token);
            if (!hashTokenRecord) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid or expired password reset token",
                };
            }
            const userIdNum = parseInt(userId);
            const user = await User_1.User.findOneBy({ id: userIdNum });
            if (!user) {
                return {
                    code: 400,
                    success: false,
                    message: "User no longer exists",
                };
            }
            const updatedPassword = await argon2_1.default.hash(password);
            await User_1.User.update({ id: userIdNum }, { password: updatedPassword });
            await tokenRecord.deleteOne();
            return {
                code: 200,
                success: true,
                message: "User password reset successfully",
                user,
            };
        }
        catch (error) {
            console.log(error);
            return error.message;
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)((_returns) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => UserMutationResponse_1.UserMutationResponse),
    (0, type_graphql_1.UseMiddleware)(checkAuth_1.checkAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgetPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("resetPasswordInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordInput_1.resetPasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
exports.UserResolver = UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
//# sourceMappingURL=User.js.map