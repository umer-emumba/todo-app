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

@Table({
  timestamps: true,
  underscored: true,
  tableName: "tasks",
})
export default class Task extends Model {
  @Length({ max: 255 })
  @Column(DataType.STRING)
  declare title: string;

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

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => TaskAttachment)
  declare task_attachments: TaskAttachment[];
}
