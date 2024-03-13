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
  HasOne,
} from "sequelize-typescript";
import Task from "./task.model";
import UserSetting from "./user-setting.model";

@DefaultScope(() => ({
  attributes: {
    exclude: ["password", "social_media_token"],
  },
}))
@Table({
  timestamps: true,
  underscored: true,
  tableName: "users",
  paranoid: true,
})
export default class User extends Model {
  @Length({ max: 255 })
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @Length({ max: 25 })
  @AllowNull
  @Column(DataType.STRING)
  declare phone: string;

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

  @HasOne(() => UserSetting)
  declare user_setting: UserSetting;
}
