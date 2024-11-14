export interface LoadingStatus {
  loading: boolean;
  message?: string;
  height?: number;
}

export class NewLoadingStatus implements LoadingStatus {
  loading = false;
  message = '';
  height = 0;
}
