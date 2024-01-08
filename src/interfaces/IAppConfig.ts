interface IDatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

interface IMailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  sender: string;
}

export interface IAppConfig {
  port: number;
  db: IDatabaseConfig;
  mailer: IMailConfig;
  jwtSecret: string;
  frontendUrl: string;
}
