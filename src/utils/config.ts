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
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
