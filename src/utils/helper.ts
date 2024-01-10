import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config";
import { IMailOptions, SocialMediaPlatform } from "../interfaces";
import { firebaseAdmin, mailer } from ".";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

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

export const verifyFirebaseSocialLogin = async (
  idToken: string
): Promise<DecodedIdToken> => {
  const auth = firebaseAdmin.auth();
  const decodedToken = await auth.verifyIdToken(idToken);
  return decodedToken;
};

export const extractSocialMediaPlatform = (
  platform: string
): SocialMediaPlatform => {
  let extractedPlatform: SocialMediaPlatform;
  switch (platform) {
    case "google.com":
      extractedPlatform = SocialMediaPlatform.GOOGLE;
      break;
    case "facebook.com":
      extractedPlatform = SocialMediaPlatform.FACEBOOK;
      break;
    case "apple.com":
      extractedPlatform = SocialMediaPlatform.APPLE;
      break;

    default:
      extractedPlatform = SocialMediaPlatform.GOOGLE;
      break;
  }

  return extractedPlatform;
};
