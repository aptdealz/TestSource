import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AboutResponse,
  ContactCommentRequest,
  ContactCommentResponse,
  ContactResponse,
  HowWeWorks,
  tnc,
} from '../models/static-pages.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/generic/response.model';
import { FAQ } from '../models/faq.model';

@Injectable({
  providedIn: 'root',
})
export class StaticPagesService {
  basePath = environment.baseApiUrl;
  private httpClient = inject(HttpClient);

  getAboutUs(): Observable<AboutResponse> {
    return this.httpClient.get<AboutResponse>(`assets/data/aboutus.json`);
  }

  getContactUs(): Observable<ContactResponse> {
    return this.httpClient.get<ContactResponse>(`assets/data/contactus.json`);
  }

  getHowWeWork(): Observable<HowWeWorks> {
    return this.httpClient.get<HowWeWorks>(`assets/data/howwework.json`);
  }

  sendContactMail(
    data: ContactCommentRequest
  ): Observable<ContactCommentResponse> {
    return this.httpClient.post<ContactCommentResponse>(
      `${this.basePath}/Account/SendContactUsMail`,
      data
    );
  }

  getCommentTypes() {
    return this.httpClient.post(
      `${this.basePath}/Account/GetContactusCommentTypes`,
      {}
    );
  }

  getFaq(): Observable<ResponseModel<FAQ[]>> {
    return this.httpClient.get<ResponseModel<FAQ[]>>(
      `${this.basePath}/v1/AppSettings/GetFAQ`
    );
  }

  getTnc(): Observable<ResponseModel<tnc>> {
    return this.httpClient.get<ResponseModel<tnc>>(
      `${this.basePath}/v1/AppSettings/GetPrivacyPolicyTermsAndConditions`
    );
  }
}
