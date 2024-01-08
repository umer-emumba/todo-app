import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  Unique,
  AllowNull,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";
import Task from "./task.model";

@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
@Table({
  timestamps: true,
  underscored: true,
  tableName: "users",
})
export default class User extends Model {
  @Length({ max: 255 })
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @Length({ max: 255 })
  @AllowNull
  @Column(DataType.STRING)
  declare password: string;

  @Length({ max: 255 })
  @AllowNull
  @Column(DataType.ENUM("GOOGLE", "FACEBOOK", "APPLE"))
  declare social_media_token: string;

  @Length({ max: 255 })
  @AllowNull
  @Column(DataType.STRING)
  declare social_media_platform: string;

  @AllowNull
  @Column(DataType.DATE)
  declare email_verified_at: Date;

  @HasMany(() => Task)
  declare tasks: Task[];
}
