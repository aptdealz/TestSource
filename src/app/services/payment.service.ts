import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { payment, paymentOrder } from '../models/payment.model';
import { ResponseModel } from '../models/generic/response.model';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}


  createRazorpayOrder(data: {
    paidAmount: number
    quoteId: string
  }): Observable<ResponseModel<paymentOrder>> {
    return this.httpClient.post<ResponseModel<paymentOrder>>(`${this.basePath}/v1/Order/Create`, data);
  }
  createPayment(data: payment): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(
      `${this.basePath}/v1/Order/Create/Payment`,
      data
    );
  }
}
