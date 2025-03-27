import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import HttpStatus from "../constants/httpStatus";
import { setAuthCookies } from "../utils/cookies";
import { registerSchema, loginSchema } from "../schemas";

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
