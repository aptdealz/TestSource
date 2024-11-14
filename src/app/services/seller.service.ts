import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { GrievanceResponse } from '../models/grievance.model';
import { Observable } from 'rxjs';
import { SellerProfileRequest } from '../models/profile.model';
import { ResponseModel } from '../models/generic/response.model';
import { CreateOrderForRevealContact, GetOrdersForSeller, OrderDetails, OrderUpdateRequest } from '../models/orders.model';
import { PartnerDetail, Seller } from '../models/seller.model';
import { RevealSellerContactRequest, RevealSellerContactResponse, RevealSellerRequest } from '../models/reveal-seller-contact-request.model';
@Injectable({
  providedIn: 'root'
})
export class SellerService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient, private auth: AuthService) {}

  getAllSellersBySubCategoryId(subcategoryId: {SubCategoryId: string}): Observable<ResponseModel<Seller[]>> {
    return this.httpClient.get<ResponseModel<Seller[]>>(
      `${this.basePath}/v1/SellerManagement/GetAllSellersBySubCategoryId?SubCategoryId=${subcategoryId}`
    );
  }
  getSellerProfile(): Observable<ResponseModel<PartnerDetail>> {
    return this.httpClient.get<ResponseModel<PartnerDetail>>(
      `${this.basePath}/v1/SellerManagement/GetMyProfileData`
    );
  }

  getSellerGrievance(): Observable<PagedResponseModel<GrievanceResponse>>  {
    return this.httpClient.get<PagedResponseModel<GrievanceResponse>>(
      `${this.basePath}/v1/Grievance/GetAllGrievancesBySeller`
    );
  }
  updateSellerProfile(data: SellerProfileRequest): Observable<ResponseModel<string>>  {
    return this.httpClient.put<ResponseModel<string>>(
      `${this.basePath}/v1/SellerManagement/Update`,
      data
    );
  }

  getSellerOrders(): Observable<PagedResponseModel<GetOrdersForSeller[]>> {
    return this.httpClient.get<PagedResponseModel<GetOrdersForSeller[]>>(
      `${this.basePath}/v1/Order/GetOrdersForSeller`
    );
  }
  getSellerOrdersById(id: string): Observable<ResponseModel<OrderDetails>>  {
    return this.httpClient.get<ResponseModel<OrderDetails>>(
      `${this.basePath}/v1/Order/GetOrderDetailsForSeller/${id}`
    );
  }
  updateOrderDetails(data: OrderUpdateRequest): Observable<ResponseModel<boolean>> {
    return this.httpClient.put<ResponseModel<boolean>>(`${this.basePath}/v1/Order/Update`, data);
  }
  createOrderForRevealSellerContact(): Observable<ResponseModel<CreateOrderForRevealContact>> {
    return this.httpClient.post<ResponseModel<CreateOrderForRevealContact>>(
      `${this.basePath}/Payment/CreateOrderForRevealSellerContact`,
      null
    );
  }
  sendForgetPasswordOTPSeller(data: {email : string}): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/SellerAuth/SendOtpByEmail`,
      data
    );
  }
  revealSellerContact(data: RevealSellerRequest): Observable<ResponseModel<RevealSellerContactResponse>> {
    return this.httpClient.post<ResponseModel<RevealSellerContactResponse>>(
      `${this.basePath}/v1/Quote/RevealSellerContact`,
      data
    );
  }

}
