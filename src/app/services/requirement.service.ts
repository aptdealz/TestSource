import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { toQueryString } from '../helpers/url.helper';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Requirement, RequirementDetail, RequirementRequest } from '../models/requirement.model';
import { ResponseModel } from '../models/generic/response.model';
import { Quote } from '../models/quote.model';
@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getRequirement(query?: any): Observable<PagedResponseModel<Requirement[]>> {
    return this.httpClient.get<PagedResponseModel<Requirement[]>>(
      `${this.basePath}/v1/Requirement/GetAllActiveRequirements?${toQueryString(
        query
      )}`
    );
  }
  getRequirementList(query?: any): Observable<PagedResponseModel<Requirement[]>> {
    return this.httpClient.get<PagedResponseModel<Requirement[]>>(
      `${this.basePath}/v1/Requirement/GetAllActiveRequirementsList?${toQueryString(
        query
      )}`
    );
  }
  getRequirementById(requirmentId: string): Observable<ResponseModel<RequirementDetail>> {
    return this.httpClient.get<ResponseModel<RequirementDetail>>(
      `${this.basePath}/v1/Requirement/Get/${requirmentId}`
    );
  }
  getAllMyPreviousRequirements(): Observable<PagedResponseModel<Requirement[]>> {
    return this.httpClient.get<PagedResponseModel<Requirement[]>>(
      `${this.basePath}/v1/Requirement/GetMyPreviousRequirements`
    );
  }
  getAllMyActiveRequirements(): Observable<PagedResponseModel<Requirement[]>> {
    return this.httpClient.get<PagedResponseModel<Requirement[]>>(
      `${this.basePath}/v1/Requirement/GetAllMyActiveRequirements`
    );
  } 
  getBuyerRequirementById(requirmentId: string): Observable<ResponseModel<RequirementDetail>> {
    return this.httpClient.get<ResponseModel<RequirementDetail>>(
      `${this.basePath}/v1/Requirement/GetBuyerRequirementDetails/${requirmentId}`
    );
  }
  createRequirement(data: RequirementRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(`${this.basePath}/v1/Requirement/Create`, data);
  }
  deleteRequirement(requirmentId: string): Observable<ResponseModel<string>> {
    return this.httpClient.delete<ResponseModel<string>>(
      `${this.basePath}/v1/Requirement/Delete/${requirmentId}`
    );
  }
  getQuotes(RequirementId: string): Observable<ResponseModel<Quote[]>> {
    return this.httpClient.get<ResponseModel<Quote[]>>(
      `${this.basePath}/v1/Quote/Get?RequirementId=${RequirementId}`
    );
  }
  getSellerRequirements(query?: any) {
    return this.httpClient
      .get<PagedResponseModel<Requirement[]>>(
        `${
          this.basePath
        }/v1/Requirement/GetAllActiveRequirements?${toQueryString(query)}`
      )
      .toPromise();
  }

}
