import { Response } from "express";
import { INTERNAL_SERVER_ERROR } from "./constants";

// Success Response Handler
export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  data?: any
): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

// Error Response Handler
export const sendErrorResponse = (
  res: Response,
  error: Error | string,
  statusCode = 500
): void => {
  const errorMessage =
    (error instanceof Error && error.message) ||
    (typeof error === "string" && error) ||
    INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};
