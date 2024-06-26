import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { __prod__ } from "../constants";
import { User } from "../entities/User";

export const createToken = (
  type: "accessToken" | "refreshToken",
  user: User
) => {
  return jwt.sign(
    { userId: user.id },
    type === "accessToken"
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === "accessToken" ? "1h" : "2d",
    }
  );
};

export const createRefreshToken = (user: User, exp?: number) => {
  return jwt.sign(
    { userId: user.id, exp: exp },
    process.env.REFRESH_TOKEN_SECRET as Secret
  );
};

export const sendRefreshToken = (res: Response, user: User, exp?: number) => {
  res.cookie(
    process.env.REFRESH_TOKEN_NAME as string,
    exp ? createRefreshToken(user, exp) : createToken("refreshToken", user),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: "molla-shop.onrender",
      expires: new Date(new Date().getTime() + 60 * 1000 * 60 * 24 * 4),
    }
  );
};
