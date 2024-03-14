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

@Table({
  timestamps: true,
  underscored: true,
  tableName: "user_settings",
  paranoid: true,
})
export default class UserSetting extends Model {
  @Default("Pending Tasks")
  @Length({ max: 50 })
  @Column(DataType.STRING)
  declare pending_task_title: string;

  @Default("Completed Tasks")
  @Length({ max: 50 })
  @Column(DataType.STRING)
  declare completed_task_title: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}
