export interface ITaskCount {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
}

export interface IAverageTaskCompleted {
  average: number;
}

export interface IOverDueTaskCount {
  count: number;
}

export interface IMaxTaskCompletionDate {
  date: Date;
}

export interface ITasksPerDay {
  day: string;
  count: number;
}
