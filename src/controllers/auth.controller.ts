import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import { createAccount } from "../services/auth.service";
import HttpStatus from "../constants/httpStatus";
import { setAuthCookies } from "../utils/cookies";

const registerSchema = z
  .object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerHandler = catchErrors(async (req, res) => {
  console.log("Inside controller");
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);

  //return response
  setAuthCookies({ res, accessToken, refreshToken }).status(HttpStatus.CREATED).json(user);
});
