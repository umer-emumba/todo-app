import { BackoffOptions } from "bullmq";

export enum QueuesEnum {
  DEFAULT = "default",
}

export enum JobTypeEnum {
  SEND_EMAIL = "send-email",
  GENERATE_PDF = "generate-pdf",
  SEND_SMS = "send-sms",
}

interface IRedisConnection {
  host: string;
  port: number;
}

interface IDefaultOptions {
  removeOnComplete: boolean;
  removeOnFail: boolean;
  attempts: number;
  backoff: number | BackoffOptions;
}

export interface IBullMqOptions {
  defaultJobOptions: IDefaultOptions;
  connection: IRedisConnection;
}
