export interface FileUploadRequest {
  base64String: string;
  fileName: string;
  fileUploadCategory: number;
}

export interface FileUploadResponse {
  fileUri: string;
  relativePath: string;
}
