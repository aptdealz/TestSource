export interface PagedResponseModel<T> {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  succeeded: boolean;
  message: string;
  errors?: string[];
  data: T;
}
