import { Component, OnInit, Input, inject, OnDestroy,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { PageService } from 'src/app/services/page.service';
import { ForgetComponent } from '../forget/forget.component';
import { SignupComponent } from '../signup/signup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private dialog = inject(MatDialog);
  errorMessage: any;
  loginForm!: FormGroup;
  role: any = 'buyer';
 /*  @Input() public isSeller = ''; */
  private ngUnsubscribe$ = new Subject<void>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<LoginComponent>) {}
  hidePassword = true;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fcm_Token: [''],
      password: ['', [Validators.required]],
    });
    this.role = this.data?.isSeller ? 'seller' : 'buyer';
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }
  onSubmit() {
     this.page.showLoader();
    const signInequest$ =
      this.role === 'buyer'
        ? this.authService.signinBuyer(this.loginForm.value)
        : this.authService.signinSeller(this.loginForm.value);
    signInequest$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.authService.setUserData(res.data);
        }
        this.dismissModal(1);
        this.page.hideLoader();
      },
      error: (err: any) => {
        if(err.error) {
          this.page.showErrorToast(
            err.error.message ? err.error.message : err.message
          );
        } else {
          this.page.showErrorToast(
            err.message ? err.message : err.error.message
         );
        }
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  selectRoles(event: any) {
    this.role = event.target.value;
  }
  forgetModal() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'forget-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ForgetComponent, {
      ...dialogConfig
    });
  }

  signUpModal() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
  }
  dismissModal(message: any) {
    this.dialogRef.close(message);
  }

  /* dismissModal = (message: string) => this.activeModal.dismiss(message); */
}
