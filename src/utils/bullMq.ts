import { IBullMqOptions } from "../interfaces";
import config from "./config";

export const BullQueueOptions: IBullMqOptions = {
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false,
  },
  connection: {
    host: config.redis.host,
    port: config.redis.port,
  },
};
