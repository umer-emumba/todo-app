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
  date: Date;
}

export interface ITasksPerDay {
  day: string;
  count: number;
}
