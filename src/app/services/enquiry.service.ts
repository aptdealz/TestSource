import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Enquiry, EnquiryRequest } from '../models/enquiry.model';
import { ResponseModel } from '../models/generic/response.model';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getMyEnquiries(): Observable<PagedResponseModel<Enquiry[]>> {
    return this.httpClient.get<PagedResponseModel<Enquiry[]>>(
      `${this.basePath}/v1/Enquiry/GetMyEnquiries`
    );
  } 
  postEnquiry(data: EnquiryRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(`${this.basePath}/v1/Enquiry/Create`, data);
  }
  
  getSellerEnquiries(): Observable<PagedResponseModel<[]>> {
    return this.httpClient.get<PagedResponseModel<[]>>(
      `${this.basePath}/v1/Enquiry/GetAllEnquiriesForSeller`
    );
  }
}
