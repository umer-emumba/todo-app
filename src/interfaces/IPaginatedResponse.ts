export interface IPaginatedResponse<Model> {
  count: number;
  rows: Model[];
}
