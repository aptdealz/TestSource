import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import {
  CreateOrderForRevealContact,
  OrderDetails,
  Orders,
} from '../models/orders.model';
import { ResponseModel } from '../models/generic/response.model';
import { BuyerProfileRequest } from '../models/profile.model';
import { CartOrder } from '../models/cart.model';
import {
  RevealBuyerContactRequest,
  RevealBuyerContactResponse,
} from '../models/reveal-buyer-contact-request.model';
import { BuyerResponse } from '../models/buyer.model';
import { GrievanceResponse } from '../models/grievance.model';
@Injectable({
  providedIn: 'root',
})
export class BuyerService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getBuyerProfile(): Observable<ResponseModel<BuyerResponse>> {
    return this.httpClient.get<ResponseModel<BuyerResponse>>(
      `${this.basePath}/v1/BuyerManagement/GetMyProfileData`
    );
  }
  getBuyerGrievance(): Observable<PagedResponseModel<GrievanceResponse[]>> {
    return this.httpClient.get<PagedResponseModel<GrievanceResponse[]>>(
      `${this.basePath}/v1/Grievance/GetAllGrievancesByBuyer`
    );
  }
  getBuyerOrders(): Observable<PagedResponseModel<Orders[]>> {
    return this.httpClient.get<PagedResponseModel<Orders[]>>(
      `${this.basePath}/v1/Order/GetOrdersForBuyer?SortBy=DATE&IsAscending=false`
    );
  }
  getBuyerOrdersById(id: string): Observable<ResponseModel<OrderDetails>> {
    return this.httpClient.get<ResponseModel<OrderDetails>>(
      `${this.basePath}/v1/Order/GetOrderDetailsForBuyer/${id}`
    );
  }
  updateBuyerProfile(
    data: BuyerProfileRequest
  ): Observable<ResponseModel<string>> {
    return this.httpClient.put<ResponseModel<string>>(
      `${this.basePath}/v1/BuyerManagement/Update`,
      data
    );
  }

  createOrderForRevealBuyerContact(): Observable<
    ResponseModel<CreateOrderForRevealContact>
  > {
    return this.httpClient.post<ResponseModel<CreateOrderForRevealContact>>(
      `${this.basePath}/Payment/CreateOrderForRevealBuyerContact`,
      null
    );
  }
  placeOrder(data: CartOrder): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/Cart/PlaceOrder`,
      data
    );
  }

  sendForgetPasswordOTPBuyer(data: {
    email: string;
  }): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/BuyerAuth/SendOtpByEmail`,
      data
    );
  }
  revealBuyerContact(
    data: RevealBuyerContactRequest
  ): Observable<ResponseModel<RevealBuyerContactResponse>> {
    return this.httpClient.post<ResponseModel<RevealBuyerContactResponse>>(
      `${this.basePath}/v1/Requirement/RevealBuyerContact`,
      data
    );
  }

  cancalOrderFromBuyer(orderId: string): Observable<ResponseModel<any>> {
    return this.httpClient.put<ResponseModel<any>>(
      `${this.basePath}/v1/Order/CancelOrder/${orderId}`,
      {}
    );
  }
}
