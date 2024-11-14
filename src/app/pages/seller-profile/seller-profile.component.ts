import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { SellerService } from 'src/app/services/seller.service';
import { PartnerDetail } from 'src/app/models/seller.model';
import { defaultImages, runImage } from 'src/app/helpers/image.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmPasswordDialogComponent } from 'src/app/shared/modals/confirm-password-dialog/confirm-password-dialog.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
})
export class SellerProfileComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private titleService = inject(Title);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private userService = inject(UserService);
  private sellerService = inject(SellerService);
  private dialog = inject(MatDialog);
  isBuyer = this.roleService.isBuyer();
  isVerified = this.userService.getIsVerified();
  hideSubscriptionPlan = environment.hideSubscriptionPlan;
  private ngUnsubscribe$ = new Subject<void>();
  loading = true;

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Seller Profile', path: '' },
  ];
  partnerDetail!: PartnerDetail;
  base64filestring: string = '';
  filename: string = '';
  fileuploadrequest: any;
  profilePhoto: any;
  bannerBackground: any = null;
  url: string = 'https://aptdealzapidev.azurewebsites.net/';
  pageTitle: string = 'Seller Profile';

  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.getSellerProfile();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getSellerProfile() {
    this.loading = this.page.showLoader(false);
    this.sellerService
      .getSellerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.partnerDetail = res.data;
            this.profilePhoto =
              res.data.profilePhoto || defaultImages.userProfile;
            const banner = res.data.companyProfile.bannerImage;
            runImage(banner).then((resp) => {
              this.bannerBackground =
                resp.result === 'success' ? resp.url : defaultImages.banner;
            });
            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Seller profile not found.'
            );
          }
        },
        error: (err: any) => {
          this.loading = this.page.handleError(err);
        },
      });
  }

  openConfirm(messageType: any) {
    let message: any;
    switch (messageType) {
      case 'logout':
        message = 'Do you want to logout?';
        break;
      case 'deactivate':
        message = 'Do you want to Deactivate account?';
        break;
      case 'switch':
        message = 'Do you want to login in with buyer account?';
        break;
      default:
        break;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
      (reason:any) => {
        if (reason !== 'yes') {
          return;
        }
        switch (messageType) {
          case 'logout':
            this.onConfirmYesAction('Logged out.');
            break;
          case 'deactivate':
            this.authService
              .deactivateAccount('Not Specified')
              .pipe(takeUntil(this.ngUnsubscribe$))
              .subscribe({
                next: (res) => {
                  this.onConfirmYesAction('Deactivated.');
                },
                error: (err) => {
                  this.page.showErrorToast('Deactivate failed.');
                  this.page.handleError(err);
                },
              });
            break;
             default:
            this.onConfirmYesAction('');
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'login-dialog';
            dialogConfig.disableClose =true;
            const dialogRef = this.dialog.open(LoginComponent, {
              ...dialogConfig
            });
            break;
        }
      }
    );
  }
  openConfirmDelete(messageType: any) {
    let message: any;
    switch (messageType) {
      case 'delete':
        message = 'Do you want to Delete account?';
        break;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message, title: messageType};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result,"res")
        if (result.message !== 'yes') {
          return;
        }
        switch (messageType) {

          case 'delete':
              this.authService
                .deleteAccount({reason:'Not Specified',password:result.password})
                .pipe(takeUntil(this.ngUnsubscribe$))
                .subscribe({
                  next: (res) => {
                    if(res.succeeded) {
                      this.onConfirmYesAction('Deleted Successfully');
                    } else {
                      this.page.showErrorToast(res.message);
                    }
                  },
                  error: (err) => {
                    this.page.showErrorToast('Deleted failed');
                    this.page.handleError(err);
                  },
                });
              break;

        }
      }
    );
  }

  onConfirmYesAction = (message: string): void => {
    if (message !== null) {
      this.page.showSuccessToast(message);
    }
    this.authService.logout();
    this.router.navigateByUrl('/');
  };

  previewSeller() {
    this.router.navigateByUrl(
      `/partner-details'${this.partnerDetail?.sellerId}`
    );
  }
  onProfilePhotoError = (targetElm: any) => {
    targetElm.src = defaultImages.userProfile;
  };
}
