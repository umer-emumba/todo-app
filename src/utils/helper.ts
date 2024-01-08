import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config";
import { IMailOptions } from "../interfaces";
import { mailer } from ".";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateJWT = (data: any, expiry?: number): string => {
  let options: jwt.SignOptions = {};
  if (expiry) {
    options.expiresIn = expiry;
  }
  const token = jwt.sign(data, config.jwt.secret, options);
  return token;
};

export const verifyJWT = (token: string): jwt.JwtPayload => {
  const decoded = jwt.verify(token, config.jwt.secret);
  let response: jwt.JwtPayload;
  if (typeof decoded === "string") {
    response = {
      payload: decoded,
    };
  } else {
    response = decoded;
  }
  return response;
};

export const sendMail = async (mailOptions: IMailOptions): Promise<void> => {
  await mailer.sendMail({
    from: config.mailer.sender,
    ...mailOptions,
  });
};
