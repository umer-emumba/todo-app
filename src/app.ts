import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import sequelize from "./models/connection";
import helmet from "helmet";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.databaseSetup();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(helmet());
  }

  private databaseSetup(): void {
    sequelize
      .sync()
      .then(() => {
        console.log("Database connected");
      })
      .catch((err: any) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  private routes(): void {}
}

export default new App().app;
