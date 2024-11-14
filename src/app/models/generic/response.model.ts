export interface ResponseModel<T> {
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: T;
}
