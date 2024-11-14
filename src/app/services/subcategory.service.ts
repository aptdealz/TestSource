import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { toQueryString } from '../helpers/url.helper';
import { Subcategory } from '../models/subcategory.model';
import { ResponseModel } from '../models/generic/response.model';
import { CategoryTree } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getSubCategories(categoryUrlName: string): Observable<Subcategory[]> {
    let query = { CategoryUrlName: categoryUrlName };
    return this.httpClient.get<Subcategory[]>(
      `${this.basePath}/v1/SubCategory/GetByCategoryUrlName?${toQueryString(
        query
      )}`
    );
  }
  getSubCategoriesById(id: string): Observable<Subcategory[]>  {
    let query = { CategoryId: id };
    return this.httpClient.get<Subcategory[]>(
      `${this.basePath}/v1/SubCategory/GetByCategoryId?${toQueryString(query)}`
    );
  }
  getSubCategoryById(id: string): Observable<ResponseModel<Subcategory>> {
    return this.httpClient.get<ResponseModel<Subcategory>>(
      `${this.basePath}/v1/SubCategory/Get/${id}`
    );
  }
  getSubCategoryTree(): Observable<CategoryTree[]> {
    return this.httpClient.get<CategoryTree[]>(
      `${this.basePath}/v1/Category/GetTreeModel`
    );
  }
}
