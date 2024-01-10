export interface IPaginatedResponse<T> {
  count: number;
  rows: T[];
}
