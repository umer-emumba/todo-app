import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config";
import {
  AttachmentType,
  BaseDto,
  IGeneratePdfOptions,
  IMailOptions,
  SocialMediaPlatform,
} from "../interfaces";
import { BadRequestError, firebaseAdmin, logger, mailer } from ".";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import * as ejs from "ejs";
import * as fs from "fs/promises";
import * as fileSystem from "fs";
import path from "path";
import puppeteer from "puppeteer";
import PDFDocument from "pdfkit";

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

export const createAndSaveTemplate = async (html: string): Promise<string> => {
  const variableNames = extractVariableNames(html);
  const dynamicData = assignRandomValues(variableNames);

  // Render the template with the data
  const renderedTemplate = ejs.render(html, dynamicData);
  const filePath = `/templates/${Date.now()}-template.html`;

  // Path to the new EJS file
  const ejsFilePath = `./public/${filePath}`;

  // Ensure the directory exists
  const directory = path.dirname(ejsFilePath);
  await fs.mkdir(directory, { recursive: true });

  await fs.writeFile(ejsFilePath, renderedTemplate);
  return filePath;
};

// Function to extract variable names from the template
function extractVariableNames(templateContent: string): string[] {
  const regex = /<%=\s*([^%>]+)\s*%>/g;
  const matches = templateContent.match(regex);
  if (!matches) return [];
  return matches.map((match) => match.replace(/<%=\s*|\s*%>/g, ""));
}

// Function to assign random values to variables
function assignRandomValues(variableNames: string[]): Record<string, any> {
  const dynamicData: Record<string, any> = {};
  variableNames.forEach((variableName) => {
    dynamicData[variableName] = getRandomValue();
  });
  return dynamicData;
}

// Function to generate a random value
function getRandomValue(): string | number {
  const types = ["string", "number"];
  const selectedType = types[Math.floor(Math.random() * types.length)];

  switch (selectedType) {
    case "string":
      return getRandomString();
    case "number":
      return getRandomNumber();

    default:
      return getRandomString();
  }
}

// Function to generate a random string
function getRandomString(): string {
  return Math.random().toString(36).substring(7);
}

// Function to generate a random number between 1 and 100
function getRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export const convertHtmlToPdf = async (options: IGeneratePdfOptions) => {
  const template = await fs.readFile(options.templatePath, "utf-8");

  const doc = new PDFDocument();
  const stream = fileSystem.createWriteStream(options.outputPath);
  doc.pipe(stream);

  doc.font("Times-Roman").fontSize(12).text(template, {
    align: "justify",
  });

  doc.end();
  stream.on("finish", () => {
    logger.info("PDF created successfully");
  });
};
