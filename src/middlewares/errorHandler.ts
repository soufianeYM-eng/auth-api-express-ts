import { ErrorRequestHandler, Response } from "express";
import HttpStatus from "../constants/httpStatus";
import { z } from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  res.status(HttpStatus.BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);
  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
};

export default errorHandler;
