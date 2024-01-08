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

interface IJWTConfig {
  secret: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

export interface IAppConfig {
  port: number;
  db: IDatabaseConfig;
  mailer: IMailConfig;
  jwt: IJWTConfig;
  frontendUrl: string;
}
