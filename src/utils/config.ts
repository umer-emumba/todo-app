import { IAppConfig } from "../interfaces";

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
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
