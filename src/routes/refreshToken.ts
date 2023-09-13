import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import { UserAuthPayload } from "../types/userAuthPayload";
import { User } from "../entities/User";
import { createToken, sendRefreshToken } from "../utils/createToken";
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const refresh_token = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
    if (!refresh_token) {
      res.json({
        code: 401,
        message: "Unauthorization",
      });
    }
    const decode = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as UserAuthPayload;

    console.log(decode);
    const existingUser = await User.findOneBy({ id: decode.userId });
    if (!existingUser) {
      return res.json({
        code: 401,
        message: "Unauthorization",
      });
    }
    sendRefreshToken(res, existingUser, decode.exp);
    return res.json({
      code: 200,
      success: true,
      accessToken: createToken("accessToken", existingUser),
    });
  } catch (error) {
    return res.json({
      code: 403,
      message: error.message,
    });
  }
});

export default route;
