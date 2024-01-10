import { Request, Response, NextFunction } from "express";
import { CustomError, logger, sendErrorResponse } from "../utils";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorMessage: string = err.message;
  let statusCode: number = 500;
  if (err instanceof CustomError) {
    statusCode = err.status;
  }
  if (err instanceof JsonWebTokenError) {
    statusCode = 401;
  }

  logger.error(err.message, err);

  return sendErrorResponse(res, errorMessage, statusCode);
};
