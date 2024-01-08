import { Request, Response, NextFunction } from "express";
import { CustomError, logger, sendErrorResponse } from "../utils";

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

  logger.error(err.message, err);

  return sendErrorResponse(res, errorMessage, statusCode);
};
