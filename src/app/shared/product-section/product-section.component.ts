import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  inject,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { PageService } from 'src/app/services/page.service';
import { RoleService } from 'src/app/services/role.service';
import { CartModalComponent } from '../../pages/cart-modal/cart-modal.component';
import { CongratsPopupComponent } from '../modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from '../modals/login/login.component';
import { SignupComponent } from '../modals/signup/signup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss'],
})
export class ProductSectionComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private dialog = inject(MatDialog);
  @Input() list: any;
  @Output('fetchMore') fetchMore = new EventEmitter<any>();
  throttle = 300;
  scrollDistance = 1;
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {}
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  addToCart(item: any) {
    if (!this.authService.isLoggedIn) {
      this.loginModal();
    } else if (this.roleService.isSeller()) {
      let message =
        'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = {text: message,isBuyer:true, title: title};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig
        });

        dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_buyer') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
        } else if (res == 'cross_click') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
        }
      });
    } else {
      this.cartService
        .addItemToCart(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.cartService.syncCart();
          },
          error: (err: any) => {
            this.page.showErrorToast('Some Error Occoured');
            this.page.handleError(err);
          },
        });
    }
  }

  addToCartAndOpenCartModal(item: any) {
    if (this.cartService.cart) {
      this.cartService.cart.forEach((ele: any) => {
        this.remove(ele.cartId);
        this.cartService.resetCart();
      });
    }

    if (!this.authService.isLoggedIn) {
      this.loginModal();
    } else if (this.roleService.isSeller()) {
      let message =
        'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = {text: message,isBuyer:true, title: title};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig
        });

        dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_buyer') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
        }
      });
    } else {
       this.page.showLoader();

      this.cartService
        .addItemToCart(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.cartService.syncCart();
            setTimeout(() => {
              this.page.hideLoader();
              this.openCart(item);
            }, 2000);
          },
          error: (err: any) => {
            this.page.showErrorToast('Some Error Occoured');
            this.page.handleError(err);
          },
        });
    }
  }
  remove(id: any) {
    this.cartService
      .deleteItemFromMyCart(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.cartService.syncCart();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  loginModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == 1) {
        //  this.page.showSuccessToast('User Logged In', '');
        }
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  openCart(item: any) {
    if (!this.authService) {
      this.loginModal();
    } else {
      const dialogConfig = new MatDialogConfig();
     dialogConfig.panelClass = 'cart-dialog';
     dialogConfig.data = {item: item};
     dialogConfig.disableClose =true;
     const dialogRef = this.dialog.open(CartModalComponent, {
       ...dialogConfig
     });
    }
  }
  isAlreadyInCart(item: any) {
    return this.cartService.isItemInCart(item.genericProductId);
  }

  onScrollDown() {
    this.fetchMore.emit();
  }
}
