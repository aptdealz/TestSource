import { Injectable } from '@angular/core';
import { LeadUserRequest } from '../models/create-lead-user.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/generic/response.model';
import { PagedResponseModel } from '../models/generic/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient, private auth: AuthService) {}

  createLeadFromUser(data: LeadUserRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/AdminLead/CreateLeadFromUser`,
      data
    );
  }
  getLeads(query?: any): Observable<PagedResponseModel<[]>> {
    return this.httpClient.get<PagedResponseModel<[]>>(`${this.basePath}/v1/Lead/GetAllMyLeads`);
  }
}
