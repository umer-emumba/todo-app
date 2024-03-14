import { IsString, MaxLength } from "class-validator";

export class UserSettingDto {
  @IsString()
  @MaxLength(50)
  pending_task_title!: string;

  @IsString()
  @MaxLength(50)
  completed_task_title!: string;
}
