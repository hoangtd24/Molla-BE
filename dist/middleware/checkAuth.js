"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuth = ({ context }, next) => {
    var _a;
    try {
        const accessToken = (_a = context.req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!accessToken) {
            throw new Error("Not authenticated to do action");
        }
        const decode = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        context.user = decode;
        return next();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map