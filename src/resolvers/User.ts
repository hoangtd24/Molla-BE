import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";
import { checkAuth } from "../middleware/checkAuth";
import { TokenModel } from "../models/TokenModel";
import { Context } from "../types/Context";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { LoginInput } from "../types/inputTypes/LoginInput";
import { RegisterInput } from "../types/inputTypes/RegisterInput";
import { createToken, sendRefreshToken } from "../utils/createToken";
import { sendMail } from "../utils/sendMail";
import { resetPasswordInput } from "../types/inputTypes/ResetPasswordInput";
@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse)
  async register(
    @Arg("registerInput") { email, password, username }: RegisterInput
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOneBy({ email });
      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: "User already register",
        };
      }
      const hashPassword = await argon2.hash(password);
      const newUser = User.create({
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
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_returns) => UserMutationResponse)
  async login(
    @Arg("loginInput") { email, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne({
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
    const verified = await argon2.verify(existingUser.password, password);
    if (!verified) {
      return {
        code: 400,
        success: false,
        message: "Email or password incorrect",
      };
    }
    sendRefreshToken(res, existingUser);

    return {
      code: 200,
      success: true,
      message: "Login successfully",
      user: existingUser,
      accessToken: createToken("accessToken", existingUser),
    };
  }

  @Mutation((_returns) => UserMutationResponse)
  async logout(@Ctx() { res }: Context): Promise<UserMutationResponse> {
    res.clearCookie(process.env.REFRESH_TOKEN_NAME as string, {
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

  @Query((_return) => UserMutationResponse)
  @UseMiddleware(checkAuth)
  async me(@Ctx() { user }: Context): Promise<UserMutationResponse> {
    try {
      const existingUser = (await User.findOne({
        where: {
          id: user?.userId,
        },
        relations: {
          cart: {
            product: true,
          },
        },
      })) as User;
      return {
        code: 200,
        success: true,
        message: "Load user successfully",
        user: existingUser,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation(() => UserMutationResponse)
  async forgetPassword(
    @Arg("email") email: string
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOneBy({ email });
    if (!existingUser) {
      return {
        code: 400,
        success: true,
        message: "User not found",
      };
    }
    await TokenModel.findOneAndDelete({ userId: existingUser.id });
    const resetToken = uuidv4();
    const hashedResetToken = await argon2.hash(resetToken);
    await TokenModel.create({
      userId: existingUser.id,
      token: hashedResetToken,
    });
    await sendMail(
      email,
      `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${existingUser.id}">Click here to reset your password</a>`
    );
    return {
      code: 200,
      success: true,
      message: "Please check your email",
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async resetPassword(
    @Arg("resetPasswordInput") { password, token, userId }: resetPasswordInput
  ): Promise<UserMutationResponse> {
    try {
      const tokenRecord = await TokenModel.findOne({ userId: userId });
      console.log(tokenRecord);
      if (!tokenRecord) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
        };
      }
      const hashTokenRecord = argon2.verify(tokenRecord.token, token);

      if (!hashTokenRecord) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
        };
      }
      const userIdNum = parseInt(userId);
      const user = await User.findOneBy({ id: userIdNum });

      if (!user) {
        return {
          code: 400,
          success: false,
          message: "User no longer exists",
        };
      }

      const updatedPassword = await argon2.hash(password);
      await User.update({ id: userIdNum }, { password: updatedPassword });

      await tokenRecord.deleteOne();

      return {
        code: 200,
        success: true,
        message: "User password reset successfully",
        user,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
