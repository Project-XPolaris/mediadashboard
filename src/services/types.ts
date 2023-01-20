
export type Task<T> = {
  id: string;
  type: string;
  status: string;
  created: string;
  output: T;
}
