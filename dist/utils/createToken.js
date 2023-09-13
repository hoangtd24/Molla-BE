"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (type, user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id }, type === "accessToken"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: type === "accessToken" ? "1h" : "2d",
    });
};
exports.createToken = createToken;
const createRefreshToken = (user, exp) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, exp: exp }, process.env.REFRESH_TOKEN_SECRET);
};
exports.createRefreshToken = createRefreshToken;
const sendRefreshToken = (res, user, exp) => {
    res.cookie(process.env.REFRESH_TOKEN_NAME, exp ? (0, exports.createRefreshToken)(user, exp) : (0, exports.createToken)("refreshToken", user), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/refresh_token",
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=createToken.js.map