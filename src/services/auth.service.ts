import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { CreateUserParams } from "../types/auth.types";
import VerificationCodeType from "../types/verificationCode.types";
import { oneYearFromNow } from "../utils/dates";

export const createAccount = async (data: CreateUserParams) => {
  // verify existing user doesn't exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }
  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  // create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow,
  });

  // send verification email

  // create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // sign access token & refresh token
  const refreshToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign({ sessionId: session._id }, JWT_SECRET, {
    audience: ["user"],
    expiresIn: "15m",
  });

  // return user & tokens
  return {
    user,
    accessToken,
    refreshToken,
  };
};
