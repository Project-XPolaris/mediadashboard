export type Task<T> = {
  id: string;
  type: string;
  status: string;
  created: string;
  output: T;
  subTask: Task<any>[]
  startTime: string
  endTime: string
  duration: number
  parentTaskId?: string
}
