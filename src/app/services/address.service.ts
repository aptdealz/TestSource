import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/generic/response.model';
import { Pincode } from '../models/static-pages.model';
import { Observable } from 'rxjs';
import { CountryResponse } from '../models/country.model';
import { CountryState } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  basePath = environment.baseApiUrl;
  constructor(public httpClient: HttpClient) {}

  getDataFromPinCode(pincode: any): Observable<ResponseModel<Pincode>> {
    return this.httpClient.get<ResponseModel<Pincode>>(
      `${this.basePath}/IndianPincode/GetPincodeInfo/${pincode}`
    );
  }
  getCountries(): Observable<CountryResponse> {
    return this.httpClient.get<CountryResponse>(
      `${this.basePath}/v1/Country/Get`
    );
  }
  getStatesByCountryId(countryId: number): Observable<CountryState[]> {
    return this.httpClient.get<CountryState[]>(
      `${this.basePath}/v1/Country/GetAllStatesByCountryId?CountryId=${countryId}`
    );
  }

  getAllDistricts(): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${this.basePath}/v1/Country/GetAllDistricts`
    );
  }
  getAllCities(): Observable<string[]> {
    return this.httpClient.get<string[]>(
      `${this.basePath}/v1/Requirement/GetAllCities`
    );
  }
}
