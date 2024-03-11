import { IBullMqOptions } from "../interfaces";
import config from "./config";

export const BullQueueOptions: IBullMqOptions = {
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
};
