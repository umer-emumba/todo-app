interface IDatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface IAppConfig {
  port: number;
  db: IDatabaseConfig;
  jwtSecret: string;
}
