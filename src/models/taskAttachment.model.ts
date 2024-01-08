import {
  Table,
  Column,
  Model,
  DataType,
  Length,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Task from "./task.model";

@Table({
  timestamps: true,
  underscored: true,
  tableName: "task_attachments",
})
export default class TaskAttachment extends Model {
  @Length({ max: 255 })
  @Column(DataType.STRING)
  declare attachment_url: string;

  @Length({ max: 255 })
  @Column(DataType.ENUM("IMAGE", "VIDEO", "PDF", "DOC"))
  declare attachment_type: string;

  @ForeignKey(() => Task)
  @Column(DataType.INTEGER)
  declare task_id: number;

  @BelongsTo(() => Task)
  declare task: Task;
}
