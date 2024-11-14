import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';
import { toQueryString } from '../helpers/url.helper';
import { Subcategory } from '../models/subcategory.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.basePath}/v1/Category/Get`);
  }
  getCategoriesByUrlName(urlName: string): Observable<Category[]>  {
    let query = { UrlName: urlName };
    return this.httpClient.get<Category[]>(
      `${this.basePath}/v1/Category/GetByUrlName?${toQueryString(query)}`
    );
  }

  getSubCategoryByUrlName(urlName: string): Observable<Subcategory[]> {
    let query = { UrlName: urlName };
    return this.httpClient.get<Subcategory[]>(
      `${this.basePath}/v1/SubCategory/GetByUrlName?${toQueryString(query)}`
    );
  }
  getTopCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(
      `${this.basePath}/v1/Category/GetAllTopCategories`
    );
  }
}
