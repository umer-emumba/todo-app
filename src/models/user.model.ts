import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  Unique,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { Task } from "./task.model";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "users",
})
export class User extends Model {
  @Column(DataType.STRING)
  @Length({ max: 255 })
  @Unique
  declare email: string;

  @Column(DataType.STRING)
  @Length({ max: 255 })
  @AllowNull
  declare password: string;

  @Column(DataType.ENUM("GOOGLE", "FACEBOOK", "APPLE"))
  @Length({ max: 255 })
  @AllowNull
  declare social_media_token: string;

  @Column(DataType.STRING)
  @Length({ max: 255 })
  @AllowNull
  declare social_media_platform: string;

  @Column(DataType.DATE)
  @AllowNull
  declare email_verified_at: Date;

  @HasMany(() => Task)
  declare tasks: Task[];
}
