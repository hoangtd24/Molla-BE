"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const createToken_1 = require("../utils/createToken");
const route = express_1.default.Router();
route.get("/", async (req, res) => {
    try {
        const refresh_token = req.cookies[process.env.REFRESH_TOKEN_NAME];
        if (!refresh_token) {
            res.json({
                code: 401,
                message: "Unauthorization",
            });
        }
        const decode = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        console.log(decode);
        const existingUser = await User_1.User.findOneBy({ id: decode.userId });
        if (!existingUser) {
            return res.json({
                code: 401,
                message: "Unauthorization",
            });
        }
        (0, createToken_1.sendRefreshToken)(res, existingUser, decode.exp);
        return res.json({
            code: 200,
            success: true,
            accessToken: (0, createToken_1.createToken)("accessToken", existingUser),
        });
    }
    catch (error) {
        return res.json({
            code: 403,
            message: error.message,
        });
    }
});
exports.default = route;
//# sourceMappingURL=refreshToken.js.map