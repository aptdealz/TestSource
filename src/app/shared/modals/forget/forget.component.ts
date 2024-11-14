import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { LoginComponent } from '../login/login.component';
import { BuyerService } from 'src/app/services/buyer.service';
import { SellerService } from 'src/app/services/seller.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseModel } from 'src/app/models/generic/response.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss'],
})
export class ForgetComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();
  sendOtpForm: any;
  verifyOtpForm: any;
  resetPasswordForm: any;
  step = 1;
  type = 'buyer';
  hidePassword = true;
  constructor(
    public fb: FormBuilder,
    public page: PageService,
    public buyerService: BuyerService,
    public sellerService: SellerService,
    public authService: AuthService,
    public dialog: MatDialog ,
    public dialogRef: MatDialogRef<ForgetComponent>
  ) {}

  ngOnInit(): void {
    this.sendOtpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }
  sendOtp() {
     this.page.showLoader();
    let call: any;
    if (this.type == 'buyer') {
      call = this.buyerService.sendForgetPasswordOTPBuyer(this.sendOtpForm.value);
    } else {
      call = this.sellerService.sendForgetPasswordOTPSeller(this.sendOtpForm.value);
    }
    call.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: ResponseModel<boolean>) => {
        if (res.succeeded) {
          this.step = 2;
          this.page.showSuccessToast(res.message);
          this.verifyOtpForm = this.fb.group({
            email: [this.sendOtpForm.value.email, [Validators.required]],
            otp: ['', [Validators.required]],
            fcm_Token: [''],
          });
        } else {
          this.page.hideLoader();
          this.page.showErrorToast(res.message);
        }
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  verifyOtp() {
     this.page.showLoader();
    let call: any;
    if (this.type == 'buyer') {
      call = this.authService.validateOTPForResetPasswordBuyer(
        this.verifyOtpForm.value
      );
    } else {
      call = this.authService.validateOTPForResetPasswordSeller(
        this.verifyOtpForm.value
      );
    }
    call.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: any) => {
        if (res.succeeded) {
          this.step = 3;
          this.resetPasswordForm = this.fb.group(
            {
              email: [this.sendOtpForm.value.email, [Validators.required]],
              token: [res.data, [Validators.required]],
              password: ['', [Validators.required]],
            },
            { validators: [this.InvalidPassword('password')] }
          );
          this.page.showSuccessToast(res.message);
        } else {
          this.page.hideLoader();
          this.page.showErrorToast(res.message);
        }
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.hideLoader();
        if(err.error) {
          this.page.showErrorToast(
            err.error.message ? err.error.message : err.message
          );
        } else {
          this.page.showErrorToast(
            err.message ? err.message : err.error.message
         );
        }
        this.page.handleError(err);
      },
    });
  }

  reset() {
     this.page.showLoader();
    let call: any;
    if (this.type == 'buyer') {
      call = this.authService.resetPasswordBuyer(this.resetPasswordForm.value);
    } else {
      call = this.authService.resetPasswordSeller(this.resetPasswordForm.value);
    }
    call.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.succeeded) {
          this.step = 4;
          this.page.showSuccessToast(res.message);
        } else {
          this.page.hideLoader();
          this.page.showErrorToast(res.message);
        }
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.showErrorToast(err.error.message);
        this.page.handleError(err);
      },
    });
  }

  login() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
  }

  InvalidPassword(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const regex = new RegExp(
        '^(?=.*?[A-Za-z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]]).{6,}$'
      );
      const valid = regex.test(control.value);
      // set error on matchingControl if validation fails
      if (!valid) {
        control.setErrors({ invalidPassword: true });
      } else {
        control.setErrors(null);
      }
    };
  }

  selectType(event: any) {
    this.type = event.target.value;
  }
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
 // dismissModal = (message: string) => this.activeModal.dismiss(message);
}
