import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Task } from "./task.model";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "task_attachments",
})
export class TaskAttachment extends Model {
  @Column(DataType.STRING)
  @Length({ max: 255 })
  declare attachment_url: string;

  @Column(DataType.ENUM("IMAGE", "VIDEO", "PDF", "DOC"))
  @Length({ max: 255 })
  declare attachment_type: string;

  @ForeignKey(() => Task)
  @Column(DataType.INTEGER)
  declare task_id: number;

  @BelongsTo(() => Task)
  declare task: Task;
}
