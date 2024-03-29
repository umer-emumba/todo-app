import { Sequelize } from "sequelize-typescript";
import config from "../utils/config";
import { logger } from "../utils";

const sequelize = new Sequelize({
  database: config.db.database,
  dialect: "mysql",
  username: config.db.user,
  password: config.db.password,
  port: config.db.port,
  models: [__dirname + "/*.model.*"],
  logging: (sql: string) => {
    logger.info(`Executed Query on ${new Date()}: ${sql}`);
    console.log(`Executed Query on ${new Date()}: ${sql}`);
  },
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  },
});

export default sequelize;
