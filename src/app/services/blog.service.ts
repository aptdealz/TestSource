import { Injectable, inject } from '@angular/core';
import {
  AddBlogCommentRequest,
  AddBlogCommentResponse,
  Blog,
  BlogComment,
} from '../models/blog.model';
import { toQueryString } from 'src/app/helpers/url.helper';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { GetBlogsRequest } from '../models/blog.model';
import { ResponseModel } from '../models/generic/response.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  basePath = environment.baseApiUrl;
  private httpClient = inject(HttpClient);

  getBlogEntries(
    data: GetBlogsRequest
  ): Observable<PagedResponseModel<Blog[]>> {
    return this.httpClient.get<PagedResponseModel<Blog[]>>(
      `${this.basePath}/v1/Blog/GetAll?${toQueryString(data)}`
    );
  }
  getBlogEntryById(id: string): Observable<ResponseModel<Blog>> {
    return this.httpClient.get<ResponseModel<Blog>>(
      `${this.basePath}/v1/Blog/Get/${id}`
    );
  }

  postComment(data: AddBlogCommentRequest): Observable<AddBlogCommentResponse> {
    return this.httpClient.post<AddBlogCommentResponse>(
      `${this.basePath}/v1/BlogComment/Create`,
      data
    );
  }

  getComments(query: any): Observable<PagedResponseModel<BlogComment[]>> {
    return this.httpClient.get<PagedResponseModel<BlogComment[]>>(
      `${this.basePath}/v1/BlogComment/GetAll?${toQueryString(query)}`
    );
  }
}
