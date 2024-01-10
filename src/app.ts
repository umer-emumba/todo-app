import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import sequelize from "./models/connection";
import helmet from "helmet";
import swaggerUi, { JsonObject } from "swagger-ui-express";
import * as YAML from "js-yaml";
import * as fs from "fs";
import "express-async-errors";

import SwaggerExpressValidator from "swagger-express-validator";
import { authRouter, reportRouter, taskRouter } from "./routes";
import { errorHandler } from "./middleware";
import {
  DATABASE_CONNECTED,
  DATABASE_CONNECTION_FAILED,
  SWAGGER_SPECS_PATH,
  logger,
  handleValidationErrors,
} from "./utils";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.databaseSetup();
    this.prepareDocsAndSetupValidator();
    this.routes();
    this.errorMiddleware();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.static("public"));
  }

  private prepareDocsAndSetupValidator(): void {
    const swaggerDocument = YAML.load(
      fs.readFileSync(SWAGGER_SPECS_PATH, "utf-8")
    ) as JsonObject;

    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    this.app.use(
      SwaggerExpressValidator({
        schema: swaggerDocument,
        validateRequest: true,
        validateResponse: false,
        requestValidationFn: handleValidationErrors,
      })
    );
  }

  private databaseSetup(): void {
    sequelize
      .authenticate()
      .then(() => {
        console.log(DATABASE_CONNECTED);
      })
      .catch((err: any) => {
        console.error(DATABASE_CONNECTION_FAILED, err);
        throw err;
      });
  }

  private routes(): void {
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/tasks", taskRouter);
    this.app.use("/api/reports", reportRouter);
  }

  private errorMiddleware(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
