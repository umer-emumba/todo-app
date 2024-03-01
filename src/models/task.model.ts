import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import User from "./user.model";
import TaskAttachment from "./taskAttachment.model";
import { TaskType } from "../interfaces";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "tasks",
  paranoid: true,
})
export default class Task extends Model {
  @Length({ max: 255 })
  @AllowNull
  @Column(DataType.STRING)
  declare title: string;

  @Length({ max: 255 })
  @AllowNull
  @Column(DataType.STRING)
  declare template_url: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.DATE)
  declare due_at: Date;

  @AllowNull
  @Column(DataType.DATE)
  declare completed_at: Date;

  @Default(0)
  @Column(DataType.TINYINT)
  declare is_completed: number;

  @Default("TEXT")
  @Column(DataType.ENUM("TEXT", "HTML"))
  declare task_type: TaskType;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => TaskAttachment)
  declare task_attachments: TaskAttachment[];
}
