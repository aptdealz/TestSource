import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/generic/response.model';
import { AllSubscription, PaymentsBySubscriptionIdResponse, Subscription, UserSubscriptionPlan } from '../models/subscription.model';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient, private auth: AuthService) {}

  getAllMySubscriptions(): Observable<ResponseModel<Subscription[]>> {
    return this.httpClient.get<ResponseModel<Subscription[]>>(
      `${this.basePath}/v1/UserSubscriptionPlan/GetAllMySubscriptions `
    );
  }
  getPaymentsBySubscriptionId(Id: string): Observable<ResponseModel<PaymentsBySubscriptionIdResponse[]>> {
    return this.httpClient.get<ResponseModel<PaymentsBySubscriptionIdResponse[]>>(
      `${this.basePath}/v1/UserSubscriptionPlanPayment/GetPaymentsBySubscriptionId?SubscriptionPlanId=${Id}`
    );
  }
  buySubscription(data: {subscriptionPlanId: string}): Observable<ResponseModel<UserSubscriptionPlan>> {
    return this.httpClient.post<ResponseModel<UserSubscriptionPlan>>(
      `${this.basePath}/v1/UserSubscriptionPlan/Subscribe`,
      data
    );
  }
  getAllSubscription(): Observable<ResponseModel<AllSubscription[]>> {
    return this.httpClient.get<ResponseModel<AllSubscription[]>>(
      `${this.basePath}/v1/SubscriptionPlan/GetAll`
    );
  }
  cancelSubscription(data: {userSubscriptionPlanId:string}): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/UserSubscriptionPlan/Cancel`,
      data
    );
  }
  upgradePlan(data: {
    currentUserSubscriptionPlanId: string,
    newSubscriptionPlanId: string
  }): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(
      `${this.basePath}/v1/UserSubscriptionPlan/Upgrade`,
      data
    );
  }

}
