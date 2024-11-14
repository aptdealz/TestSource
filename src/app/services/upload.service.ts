import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FileUploadRequest,
  FileUploadResponse,
} from '../models/file-upload.model';
import { ResponseModel } from '../models/generic/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  basePath = environment.baseApiUrl;
  private http = inject(HttpClient);

  uploadFile(
    fileUploadRequest: FileUploadRequest
  ): Observable<ResponseModel<FileUploadResponse>> {
    return this.http.post<ResponseModel<FileUploadResponse>>(
      `${this.basePath}/FileUpload`,
      fileUploadRequest
    );
  }
}
