import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../models/generic/paged-response.model';
import { Testimonial } from '../models/testimonial.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  basePath = environment.baseApiUrl;
  private httpClient = inject(HttpClient);

  getTestimonials(): Observable<PagedResponseModel<Testimonial[]>> {
    return this.httpClient.get<PagedResponseModel<Testimonial[]>>(
      `${this.basePath}/v1/Testimonial/GetAll`
    );
  }
}
