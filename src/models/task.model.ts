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
import { User } from "./user.model";
import { TaskAttachment } from "./taskAttachment.model";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "tasks",
})
export class Task extends Model {
  @Column(DataType.STRING)
  @Length({ max: 255 })
  declare title: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.DATE)
  declare due_at: Date;

  @Column(DataType.DATE)
  @AllowNull
  declare completed_at: Date;

  @Column(DataType.TINYINT)
  @Default(0)
  declare is_completed: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => TaskAttachment)
  declare task_attachments: TaskAttachment[];
}
