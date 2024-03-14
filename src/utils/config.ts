import dotenv from "dotenv";
import { IAppConfig } from "../interfaces";
dotenv.config();

const config: IAppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3000,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "db",
  },
  mailer: {
    host: process.env.SMTP_HOST || "",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
    sender: process.env.SMTP_SENDER || "",
  },
  frontendUrl: process.env.FRONTEND_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "",
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY
      ? parseInt(process.env.JWT_ACCESS_EXPIRY)
      : 900,
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY
      ? parseInt(process.env.JWT_REFRESH_EXPIRY)
      : 604800,
  },
  maxTaskCount: process.env.MAX_TASK_COUNT
    ? parseInt(process.env.MAX_TASK_COUNT)
    : 50,
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  twillio: {
    sid: process.env.TWILLIO_SID || "",
    token: process.env.TWILLIO_TOKEN || "",
    from: process.env.TWILLIO_FROM || "",
  },
  tinyUrlToken: process.env.TINY_URL_TOKEN || "",
};

export default config;
