import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/generic/response.model';
import { Quote, QuoteDetail, SendQuoteRequest } from '../models/quote.model';
import { PagedResponseModel } from '../models/generic/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getQuotesById(quotesId: string): Observable<ResponseModel<QuoteDetail>> {
    return this.httpClient.get<ResponseModel<QuoteDetail>>(
      `${this.basePath}/v1/Quote/Get/${quotesId}`
    );
  }
  getBuyerQuotes(): Observable<PagedResponseModel<Quote[]>> {
    return this.httpClient.get<PagedResponseModel<Quote[]>>(
      `${this.basePath}/v1/Quote/GetAllQuotesForMyRequirement`
    );
  }
  getSubmittedQuotesByMe(): Observable<PagedResponseModel<Quote[]>> {
    return this.httpClient.get<PagedResponseModel<Quote[]>>(
      `${this.basePath}/v1/Quote/GetSubmittedQuotesByMe`
    );
  }
  createQuote(data: SendQuoteRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(`${this.basePath}/v1/Quote/Create`, data);
  }
  rejectQuote(id: string): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(
      `${this.basePath}/v1/Quote/RejectQuote?quoteId=${id}`,
      {}
    );
  }
}
