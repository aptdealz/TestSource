import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { ResponseModel } from '../models/generic/response.model';
import { User } from '../models/user.model';
import { CartService } from './cart.service';
import { RoleService } from './role.service';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { UserStatus, LoggedOutStatus } from '../models/user-status.model';
import { ResetPasswordRequest, signUpBuyer, signUpSeller } from '../models/auth.model';
import { PageService } from './page.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private page = inject(PageService);
  private cartService = inject(CartService);
  private roleService = inject(RoleService);
  private userService = inject(UserService);
  private httpClient = inject(HttpClient);
  private basePath = environment.baseApiUrl;

  get isLoggedIn() {
    const user = this.userService.getUser();
    return user !== null;
  }

  registerAsBuyer(data: signUpBuyer): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>> (
      `${this.basePath}/v1/BuyerAuth/RegisterAsBuyer`,
      data
    );
  }

  signin(data: LoginRequest): Observable<ResponseModel<User>> {
    return this.http.post<ResponseModel<User>>(
      `${this.basePath}/v1/UserAuth/authenticate`,
      data
    );
  }

  signinBuyer(data: LoginRequest): Observable<ResponseModel<User>> {
    return this.http.post<ResponseModel<User>>(
      `${this.basePath}/v1/BuyerAuth/authenticateWithCredentials`,
      data
    );
  }

  signupSeller(signupRequest: signUpSeller): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/SellerAuth/Register`,
      signupRequest
    );
  }

  signinSeller(data: LoginRequest): Observable<ResponseModel<User>> {
    return this.http.post<ResponseModel<User>>(
      `${this.basePath}/v1/SellerAuth/authenticate`,
      data
    );
  }

  deactivateAccount(reasonForDeactivation: string): Observable<ResponseModel<boolean>> {
    const data = {
      userId: this.userService.getUserId(),
      reasonForDeactivation,
    };

    return this.http.post<ResponseModel<boolean>>(`${this.basePath}/account/deactivateuser`, data);
  }
  deleteAccount(obj:any): Observable<ResponseModel<boolean>> {
    const data = {
      reasonForDeactivation: obj.reason,
    password: obj.password
    };

    return this.http.post<ResponseModel<boolean>>(`${this.basePath}/Account/DeleteUserAccount`, data);
  }
  setUserData(user: User): void {
    if(this.page.isPlatformBrowser()){
      localStorage.setItem('userData', JSON.stringify(user));
      this.userStatus$.next(this.getUserStatus());
    }
    
  }

  resetUserData = (): void => {
    if(this.page.isPlatformBrowser()){
      localStorage.clear();
      this.cartService.resetCart();
      this.userStatus$.next(new LoggedOutStatus());
      this.page.hideLoader();
    }

  };

  logout = (): void => {
    const user = this.userService.getUser();
    if (user !== null) {
      const url = `${environment.baseApiUrl}/account/logout`;
      const data = {
        refreshToken: user.refreshToken,
        loginTrackingKey: user.loginTrackingKey,
      };
       this.page.showLoader();
      this.http.post(url, data).subscribe({
        next: (_: any) => {},
        error: (err: any) => {
        },
      });
    }
    this.resetUserData();
  };

  private getUserStatus = (): UserStatus => {
    let UserStatus = new LoggedOutStatus();
    const currentUser = this.userService.getUser();
    const roles = this.roleService.getRoles();
    if (currentUser) {
      UserStatus = {
        loggedIn: true,
        role: roles[0] ?? '',
        buyer: this.roleService.isUserinRole('Buyer'),
        seller: this.roleService.isUserinRole('Seller'),
      };
    }
    return UserStatus;
  };

  private userStatus$ = new BehaviorSubject<UserStatus>(this.getUserStatus());

  userStatus(): Observable<UserStatus> {
    return this.userStatus$.asObservable();
  }
  logoutApi(data: {loginTrackingKey: string, refreshToken:string}): Observable<ResponseModel<boolean>> {
    return this.httpClient.post<ResponseModel<boolean>>(`${this.basePath}/Account/logout`, data);
  }
  validateOTPForResetPasswordSeller(data: {
    email: string,
    otp: string,
    fcm_Token: string
}): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(
      `${this.basePath}/v1/SellerAuth/ValidateOtpForResetPassword`,
      data
    );
  }
  validateOTPForResetPasswordBuyer(data: {
    email: string,
    otp: string,
    fcm_Token: string
}): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(
      `${this.basePath}/v1/BuyerAuth/ValidateOtpForResetPassword`,
      data
    );
  }

  resetPasswordBuyer(data: ResetPasswordRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/BuyerAuth/ResetPassword`,
      data
    );
  }


  resetPasswordSeller(data: ResetPasswordRequest): Observable<ResponseModel<string>> {
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/SellerAuth/ResetPassword`,
      data
    );
  }
}
