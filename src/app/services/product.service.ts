import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Product } from '../models/product.model';
import { SellerProductTitle } from '../models/seller-product-title.model';
import { toQueryString } from 'src/app/helpers/url.helper';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/generic/response.model';
import { GenericProduct } from '../models/generic-product.model';
import { GenericProductTitle } from '../models/GenericProductTitle.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  basePath = environment.baseApiUrl;
  private httpClient = inject(HttpClient);

  getSellerProductsSuggestions(query: {
    Title: string;
  }): Observable<ResponseModel<SellerProductTitle[]>> {
    return this.httpClient.get<ResponseModel<SellerProductTitle[]>>(
      `${this.basePath}/v1/SellerProduct/GetSellerProductsTitle?${toQueryString(
        query
      )}`
    );
  }

  getTopSellerProducts(): Observable<PagedResponseModel<Product[]>> {
    return this.httpClient.get<PagedResponseModel<Product[]>>(
      `${this.basePath}/v1/SellerProduct/GetAllTopSellerProducts`
    );
  }
  getSellersGetByUser(id: string, query: string): Observable<PagedResponseModel<Product[]>> {
    return this.httpClient.get<PagedResponseModel<Product[]>>(
      `${this.basePath}/v1/SellerProduct/GetByUser?UserId=${id}&${toQueryString(
        query
      )}`
    );
  }
  getAllSellerProductsById(Id: string): Observable<ResponseModel<Product>> {
    return this.httpClient.get<ResponseModel<Product>>(
      `${this.basePath}/v1/SellerProduct/GetById/${Id}`
    );
  }
  getSellerProductGetByOthers(query: any): Observable<PagedResponseModel<Product[]>> {
    return this.httpClient.get<PagedResponseModel<Product[]>>(
      `${this.basePath}/v1/SellerProduct/GetByOthers?${toQueryString(query)}`
    );
  }
  getSellerProductGetAll(query: any): Observable<PagedResponseModel<Product[]>> {
    return this.httpClient.get<PagedResponseModel<Product[]>>(
      `${this.basePath}/v1/SellerProduct/GetAll?${toQueryString(query)}`
    );
  }
  getGenericProducts(query: any): Observable<PagedResponseModel<GenericProduct[]>> {
    return this.httpClient.get<PagedResponseModel<GenericProduct[]>>(
      `${this.basePath}/v1/GenericProduct/GetAll?${toQueryString(query)}`
    );
  }
  getGenericProductsByUrlTitle(query: any): Observable<ResponseModel<GenericProduct>>  {
    return this.httpClient.get<ResponseModel<GenericProduct>>(
      `${this.basePath}/v1/GenericProduct/GetByUrlTitle?${toQueryString(query)}`
    );
  }
  getAllSellerProductsTitle(query:any): Observable<ResponseModel<SellerProductTitle[]>> {
    return this.httpClient.get<ResponseModel<SellerProductTitle[]>>(
      `${this.basePath}/v1/SellerProduct/GetSellerProductsTitle?${toQueryString(
        query
      )}`
    );
  }



  getAllGenericProductsTitle(query: any): Observable<ResponseModel<GenericProductTitle[]>> {
    return this.httpClient.get<ResponseModel<GenericProductTitle[]>>(
      `${this.basePath}/v1/GenericProduct/GetGenericProductsTitle?${toQueryString(
        query
      )}`
    );
  }


  getAllSellerProducts(query: any): Observable<PagedResponseModel<Product[]>> {
    return this.httpClient.get<PagedResponseModel<Product[]>> (
      `${this.basePath}/v1/SellerProduct/GetAll?${toQueryString(query)}`
    );
  }

}
