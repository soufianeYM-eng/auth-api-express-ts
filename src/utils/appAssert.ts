import assert from "node:assert";
import HttpStatus from "../constants/httpStatus";
import AppErrorCode from "../constants/appErrorCode";
import AppError from "./appError";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatus,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

/**
 * Asserts a condition and throws an AppError if the condition is falsy
 */
const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
