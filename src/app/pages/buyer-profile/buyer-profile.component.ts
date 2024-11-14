import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { RoleService } from 'src/app/services/role.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BuyerService } from 'src/app/services/buyer.service';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { defaultImages } from 'src/app/helpers/image.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmPasswordDialogComponent } from 'src/app/shared/modals/confirm-password-dialog/confirm-password-dialog.component';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss'],
})
export class BuyerProfileComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private titleService = inject(Title);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private buyerService = inject(BuyerService);
  private dialog = inject(MatDialog);
  isBuyer = this.roleService.isBuyer();

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Buyer Profile', path: '' },
  ];
  buyerProfileData!: BuyerResponse;
  base64filestring: string = '';
  filename: string = '';
  fileuploadrequest: any;
  profilePhoto: any;
  url: string = 'https://aptdealzapidev.azurewebsites.net/';
  pageTitle: string = 'Buyer Profile';
  private ngUnsubscribe$ = new Subject<void>();
  loading = true;
  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.getBuyerProfile();

    this.page.myProfileUpdate.subscribe({
      next: (res) => {
        this.getBuyerProfile();
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
  getBuyerProfile() {
    this.loading = this.page.showLoader(false);
    this.buyerService
      .getBuyerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.buyerProfileData = res.data;
            this.profilePhoto =
              res.data.profilePhoto || defaultImages.userProfile;
            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Buyer profile not found.'
            );
          }
        },
        error: (err: any) => {
          this.loading = this.page.handleError(err);
        },
      });
  }
  onProfilePhotoError = (targetElm: any) => {
    targetElm.src = defaultImages.userProfile;
  };
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
        message = 'Do you want to login in with seller account?';
        break;
      default:
        break;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message, title: messageType};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result !== 'yes') {
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
                  this.onConfirmYesAction('Deactivated Successfully');
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
            if (messageType === 'switch') {
              dialogConfig.data = {isSeller: 'seller'};
              //loginModalRef.componentInstance.isSeller = 'seller';
            }

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
}
