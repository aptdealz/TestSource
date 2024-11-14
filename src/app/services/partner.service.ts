import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PartnerDetail, Seller } from '../models/seller.model';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { ResponseModel } from '../models/generic/response.model';
@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getAllTopSellers(): Observable<PagedResponseModel<Seller[]>> {
    return this.httpClient.get<PagedResponseModel<Seller[]>>(
      `${this.basePath}/v1/SellerManagement/GetAllTopSellers`
    );
  }
  getAllSellers(): Observable<ResponseModel<Seller[]>> {
    return this.httpClient.get<ResponseModel<Seller[]>>(
      `${this.basePath}/v1/SellerManagement/GetAllSellers`
    );
  }
  getSellersById(id: string): Observable<ResponseModel<PartnerDetail>> {
    return this.httpClient.get<ResponseModel<PartnerDetail>>(
      `${this.basePath}/v1/SellerManagement/Get/${id}`
    );
  }
}
