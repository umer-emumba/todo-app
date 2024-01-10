import { Transform } from "class-transformer";

export class PaginationDto {
  @Transform(({ value }) => Number(value))
  limit?: number = 10;

  @Transform(({ value }) => Number(value))
  offset?: number = 0;
  text?: string = "";
  order?: OrderEnum = OrderEnum.DESC;
}

export enum OrderEnum {
  ASC = "asc",
  DESC = "desc",
}
