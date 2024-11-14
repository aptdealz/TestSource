import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService {
  private router = inject(Router);
  canActivate(role: 'Buyer' | 'Seller') {
    return this.handle(role);
  }

  handle(role: string): true | UrlTree {
    const currentRole = inject(RoleService).getCurrentRole();
    return currentRole === role ? true : this.router.parseUrl('/');
  }
}

// route: ActivatedRouteSnapshot, state: RouterStateSnapshot
export const buyerRoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => inject(RoleGuardService).canActivate('Buyer');

export const sellerRoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => inject(RoleGuardService).canActivate('Seller');
