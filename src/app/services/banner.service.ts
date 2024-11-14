import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BannerResponse } from '../models/banner.model';
import {Observable} from 'rxjs'
import { PagedResponseModel } from '../models/generic/paged-response.model';
@Injectable({
  providedIn: 'root'
})
export class BannerService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getBannerImages(position: number): Observable<PagedResponseModel<BannerResponse[]>> {
    return this.httpClient.get<PagedResponseModel<BannerResponse[]>>(
      `${this.basePath}/v1/Banner/GetByScreenPosition?ScreenPosition=${position}`
    );
  }
}
