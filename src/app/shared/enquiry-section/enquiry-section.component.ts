import { Component, OnInit, Input, Output, EventEmitter ,inject} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SendEnquiryComponent } from '../modals/send-enquiry/send-enquiry.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from '../modals/login/login.component';
import { PageService } from 'src/app/services/page.service';
import { RoleService } from 'src/app/services/role.service';
import { CongratsPopupComponent } from '../modals/congrats-popup/congrats-popup.component';
import { SignupComponent } from '../modals/signup/signup.component';
import { CartService } from 'src/app/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { CartModalComponent } from 'src/app/pages/cart-modal/cart-modal.component';


@Component({
  selector: 'app-enquiry-section',
  templateUrl: './enquiry-section.component.html',
  styleUrls: ['./enquiry-section.component.scss'],
})
export class EnquirySectionComponent implements OnInit {
  //list: any = [];
  @Input() list: any;
  @Input() loading: any;
  @Input() from_pdtsearch!:boolean;
  @Output('fetchMore') fetchMore = new EventEmitter<any>();
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private cartService = inject(CartService);
  private ngUnsubscribe$ = new Subject<void>();
  throttle = 300;
  scrollDistance = 1;
  constructor(
    public dialog: MatDialog,
     public auth: AuthService
    ) {}
    

  ngOnInit(): void {}
  sendEnquiry(item: any) {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'enquiry-dialog';
    dialogConfig.data = {item: item};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SendEnquiryComponent, {
      ...dialogConfig
    });
  }

  onScrollDown() {
    this.fetchMore.emit();
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



  addToCartAndOpenCartModal(item: any) {
   /* if (this.cartService.cart) {
      this.cartService.cart.forEach((ele: any) => {
        this.remove(ele.cartId);
        this.cartService.resetCart();
      });
    }*/
    if (!this.auth.isLoggedIn) {
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
          this.auth.logout();
          /*  const closeModalRef = this.modalService.open(LoginComponent, {
             size: 'lg',
             centered: true,
           }); */
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.auth.logout();
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


  openCart(item: any) {
    if (!this.auth.isLoggedIn) {
      this.loginModal();
    } else {
      /* const modalRef = this.modalService.open(CartModalComponent, {
        size: 'xl',
        centered: true,
      });
      modalRef.componentInstance.item = item; */


     const dialogConfig = new MatDialogConfig();
     dialogConfig.panelClass = 'cart-dialog';
     dialogConfig.data = {item: item};
     dialogConfig.disableClose =true;
     const dialogRef = this.dialog.open(CartModalComponent, {
       ...dialogConfig
     });
    }
  }

}
