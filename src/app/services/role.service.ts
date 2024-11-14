import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(public userService: UserService){}
  getRoles(): string[] {
    const user = this.userService.getUser();
    if (user === null) {
      return [];
    }
    return user.roles;
  }

  getCurrentRole(): string {
    const roles = this.getRoles();
    return roles[0] ?? '';
  }

  isUserinRole = (roleName: 'Buyer' | 'Seller'): boolean => {
    const roles = this.getRoles();
    return roles.length === 0 ? false : roles.includes(roleName);
  };

  isBuyer = (): boolean => {
    return this.isUserinRole('Buyer');
  };

  isSeller = (): boolean => {
    return this.isUserinRole('Seller');
  };
}
