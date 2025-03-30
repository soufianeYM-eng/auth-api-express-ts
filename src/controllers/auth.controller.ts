import catchErrors from "../utils/catchErrors";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
} from "../services/auth.service";
import HttpStatus from "../constants/httpStatus";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import {
  registerSchema,
  loginSchema,
  verificationCodeSchema,
} from "../schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(async (req, res) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call auth service
  const { user, accessToken, refreshToken } = await createAccount(request);

  //return response
  setAuthCookies({ res, accessToken, refreshToken })
    .status(HttpStatus.CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  // validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call auth service
  const { accessToken, refreshToken } = await loginUser(request);

  //return response
  setAuthCookies({ res, accessToken, refreshToken })
    .status(HttpStatus.CREATED)
    .json({ message: "Login successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");
  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
    clearAuthCookies(res).status(HttpStatus.OK).json({
      message: "Logout successful",
    });
  } else {
    appAssert(payload, HttpStatus.BAD_REQUEST, "Invalid Token!");
  }
});

export const refreshHandler = catchErrors(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(oldRefreshToken, HttpStatus.UNAUTHORIZED, "Missing refresh token");

  // call auth service
  const { accessToken, newRefreshToken: refreshToken } =
    await refreshUserAccessToken(oldRefreshToken);

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
  }

  res
    .status(HttpStatus.OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed!" });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.body);
});
