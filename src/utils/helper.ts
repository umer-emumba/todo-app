import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config";
import {
  AttachmentType,
  BaseDto,
  IMailOptions,
  SocialMediaPlatform,
} from "../interfaces";
import { BadRequestError, firebaseAdmin, mailer } from ".";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

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

export const extractFileTypeFromMime = (mimeType: string): AttachmentType => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif"];
  const videoTypes = ["video/mp4", "video/mpeg"];
  const pdfTypes = ["application/pdf"];
  const docTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (imageTypes.includes(mimeType)) {
    return AttachmentType.IMAGE;
  } else if (videoTypes.includes(mimeType)) {
    return AttachmentType.VIDEO;
  } else if (pdfTypes.includes(mimeType)) {
    return AttachmentType.PDF;
  } else if (docTypes.includes(mimeType)) {
    return AttachmentType.DOC;
  } else {
    return AttachmentType.IMAGE;
  }
};

export const createAndValidateDto = async <T extends BaseDto>(
  dtoClass: new () => T,
  dtoData: object
): Promise<T> => {
  const dtoInstance = plainToClass(dtoClass, dtoData);
  const errors: ValidationError[] = await validate(dtoInstance, {
    whitelist: true,
  });
  if (errors.length > 0) {
    const errorMessages: string[] = [];

    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          errorMessages.push(constraint);
        });
      }
    });

    throw new BadRequestError(errorMessages.join(", "));
  }

  return dtoInstance;
};
