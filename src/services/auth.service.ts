import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { CreateUserParams, LoginParams } from "../types/auth.types";
import VerificationCodeType from "../types/verificationCode.types";
import { oneYearFromNow } from "../utils/dates";
import appAssert from "../utils/appAssert";
import HttpStatus from "../constants/httpStatus";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

export const createAccount = async (data: CreateUserParams) => {
  // verify existing user doesn't exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, HttpStatus.CONFLICT, "Email already in use!");

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
  const accessToken = signToken({ userId: user._id ,sessionId: session._id })
  const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions)

  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
  // Check if user exists
  const user = await UserModel.findOne({
    email,
  });

  appAssert(user, HttpStatus.UNAUTHORIZED, 'Invalid email or password')

  // Compare passwords
  const isValid = await user.comparePassword(password)

  const userId = user._id;
  // Create a session
  const session = await SessionModel.create({
    userId,
    userAgent
  })

  const sessionInfo = {
    sessionId: session._id
  }

  // sign access token & refresh token
  const accessToken = signToken({ userId: user._id ,...sessionInfo })
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)


  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
