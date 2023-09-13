import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";
import jwt, { Secret } from "jsonwebtoken";
import { UserAuthPayload } from "../types/userAuthPayload";
export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const accessToken = context.req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new Error("Not authenticated to do action");
    }
    const decode = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as UserAuthPayload;

    context.user = decode;
    return next();
  } catch (error) {
    throw new Error(error.message);
  }
};
