import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { CongratsPopupComponent } from 'src/app/shared/modals/congrats-popup/congrats-popup.component';
import { ErrorHandleComponent } from 'src/app/shared/modals/error-handle/error-handle.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RoleService } from 'src/app/services/role.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { AllSubscription } from 'src/app/models/subscription.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  private meta = inject(Meta);
  private router = inject(Router);
  private titleService = inject(Title);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private subscriptionService = inject(SubscriptionService);
  private dialog = inject(MatDialog);
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Subscription', path: '' },
  ];
  list: AllSubscription[] = [];
  pageTitle: string = 'B2B Marketplace for Wholesale Buyers in India | Pricing';
  selectedItems: any = {};
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content:
              'As the best B2B Marketplace for Wholesale Buyers in India, we provide different plans with different product listing & pricing. Choose a Quotesouk subscription plan that\'s right for you.'
    });

    this.titleService.setTitle(this.pageTitle);
    this.subscriptionService
      .getAllSubscription()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res.data;
          this.setSubsciption();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  setSubsciption() {
    this.list.forEach((item: any, index: any) => {
      this.selectedItems[index] = item.pricingInfo[0].subscriptionPlanId;
    });
  }

  goToSubscription() {}
  buyNow(i: any) {
    if (this.roleService.isBuyer()) {
      let message =
        'You are currently logged in as buyer. Please login as a seller to subscribe a plan.';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'congrats-dialog';
      dialogConfig.data = {text: message,title: title};
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(CongratsPopupComponent, {
        ...dialogConfig
      });
    
      dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_seller') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.data = {isSeller: 'seller'};
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          this.router.navigateByUrl('/become-vendor');
        }
      });
    } else if (this.roleService.isSeller()) {
       this.page.showLoader();
      let data = {
        subscriptionPlanId: this.selectedItems[i],
      };
      this.subscriptionService
        .buySubscription(data)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            if (res.succeeded == true) {
              if (res.data.paymentURL) {
                this.page.showSuccessToast(res.message);
                window.open(res.data.paymentURL, '_blank');
              }
            } else {
              const dialogConfig = new MatDialogConfig();
                dialogConfig.panelClass = 'error-dialog';
                dialogConfig.data = {text: res.message, };
                dialogConfig.disableClose =true;
                
                const dialogRef = this.dialog.open(ErrorHandleComponent, {
                  ...dialogConfig
                });
            }
            this.page.hideLoader();
          },
          error: (err: any) => {
            this.page.hideLoader();
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'error-dialog';
            dialogConfig.data = {text: err.error.message, };
            dialogConfig.disableClose =true;
            const dialogRef = this.dialog.open(ErrorHandleComponent, {
              ...dialogConfig
            });
            this.page.handleError(err);
          },
        });
    }
    else{
      let message =
      'Please login as a seller to subscribe a plan.';
    let title = 'Access Denied';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'congrats-dialog';
    dialogConfig.data = {text: message,title: title};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(CongratsPopupComponent, {
      ...dialogConfig
    });
  
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'login_seller') {
        this.authService.logout();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'login-dialog';
        dialogConfig.data = {isSeller: 'seller'};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(LoginComponent, {
          ...dialogConfig
        });
      } else if (res == 'cross_click') {
        this.authService.logout();
        this.router.navigateByUrl('/become-vendor');
      }
    });
    }
  }
  getPrice(i: any) {
    let data = this.list[i].pricingInfo;
    let result = data.find(
      (ele: any) => ele.subscriptionPlanId == this.selectedItems[i]
    );
    return result;
  }
  selectItems2(value: any, i: any) {
    this.selectedItems[i] = value;
  }
  getName(i: any) {
    let data = this.list[i].pricingInfo;
    let result = data.find(
      (ele: any) => ele.subscriptionPlanId == this.selectedItems[i]
    );
    return result;
  }
}
