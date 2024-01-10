export interface ITaskCount {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
}

export interface IAverageTaskCompleted {
  averageCompletedTasksPerDay: number;
}

export interface IOverDueTaskCount {
  overdueTaskCount: number;
}

export interface IMaxTaskCompletionDate {
  maxTaskCompletionDate: Date;
  completedTasksCount: number;
}

export interface ITasksPerDay {
  day: string;
  count: number;
}
