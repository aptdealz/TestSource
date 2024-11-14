import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Grievance, GrievanceRequest, GrievanceSubmitRequest } from '../models/grievance.model';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/generic/response.model';

@Injectable({
  providedIn: 'root',
})
export class GrievanceService {
  basePath = environment.baseApiUrl;
  private httpClient = inject(HttpClient);

  getSellerGrievanceDetails(
    id: string
  ): Observable<PagedResponseModel<Grievance>> {
    return this.httpClient.get<PagedResponseModel<Grievance>>(
      `${this.basePath}/v1/Grievance/GetGrievancesDetailsForSeller/${id}`
    );
  }
  getBuyerGrievanceDetails(id: string): Observable<ResponseModel<Grievance>> {
    return this.httpClient.get<ResponseModel<Grievance>>(
      `${this.basePath}/v1/Grievance/GetGrievancesDetailsForBuyer/${id}`
    );
  }
  submitSellerGrievance(data: GrievanceSubmitRequest): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/Grievance/SubmitGrievanceResponseFromSeller`,
      data
    );
  }
  submitBuyerGrievance(data: GrievanceSubmitRequest): Observable<ResponseModel<boolean>>  {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/Grievance/SubmitGrievanceResponseFromBuyer`,
      data
    );
  }
  addSellerGrievance(data: GrievanceRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/Grievance/CreateGrievanceFromSeller`,
      data
    );
  }

  addBuyerGrievance(data: GrievanceRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/Grievance/CreateGrievanceFromBuyer`,
      data
    );
  }
}
