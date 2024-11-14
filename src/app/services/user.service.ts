import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private page = inject(PageService);
  getUser = (): User | null => {
    let userInStorage = this.page.isPlatformBrowser()?localStorage.getItem('userData'):null
    if (userInStorage === null) {
      return null;
    }
    const user: User = JSON.parse(userInStorage);
    return user;
  };

  getUserId = (): string => {
    const user = this.getUser();
    if (user === null) {
      return '';
    }
    return user.id;
  };

  getToken = (): string => {
    const user = this.getUser();
    if (user === null) {
      return '';
    }
    return user.jwToken;
  };

  getIsVerified = (): boolean => {
    const user = this.getUser();
    if (user === null) {
      return false;
    }
    return user.isVerified;
  };
}
