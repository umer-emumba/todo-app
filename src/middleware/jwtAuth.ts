import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  INVALID_TOKEN,
  TOKEN_MISSING,
  UnauthorizedError,
  verifyJWT,
} from "../utils";
import { userRepository } from "../repositories";

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError(TOKEN_MISSING);
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    throw new ForbiddenError(INVALID_TOKEN);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    throw new ForbiddenError(INVALID_TOKEN);
  }

  req.user = user;
  next();
};
