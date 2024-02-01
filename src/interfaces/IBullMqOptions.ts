export enum QueuesEnum {
  DEFAULT = "default",
}

export enum JobTypeEnum {
  SEND_EMAIL = "send-email",
}

interface IRedisConnection {
  host: string;
  port: number;
}

interface IDefaultOptions {
  removeOnComplete: boolean;
  removeOnFail: boolean;
}

export interface IBullMqOptions {
  defaultJobOptions: IDefaultOptions;
  connection: IRedisConnection;
}
