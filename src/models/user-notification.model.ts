import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user.model";
import { NotificationTypeEnum } from "../interfaces";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "user_notifications",
  paranoid: true,
})
export default class UserNotification extends Model {
  @Length({ max: 50 })
  @Column(DataType.ENUM("SMS", "EMAIL"))
  declare notification_type: NotificationTypeEnum;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}
