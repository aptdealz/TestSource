import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  errorMessage: any;
  registrationForm!: FormGroup;
  private ngUnsubscribe$ = new Subject<void>();
  hidePassword = true;
  constructor(
   public fb: FormBuilder,
    public authService: AuthService,
    public page: PageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupComponent>
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.maxLength(13), Validators.required]],
        password: [
          '',
          [
            Validators.required,
            // Validators.pattern(`^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z]).{8,}$`)
          ],
        ],
        confirmPassword: ['', Validators.required],
        firebaseVerificationId: [''],
        latitude: [0, Validators.required],
        longitude: [0, Validators.required],
        termconditioncheck: [false, Validators.required],
      },
      {
        validator: [
          this.ConfirmedValidator('password', 'confirmPassword'),
          this.tncValidator('termconditioncheck'),
          this.phoneNumberValidator('phoneNumber'),
        ],
      }
    );
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
    let registrationData = this.registrationForm.value;
    delete registrationData.termconditioncheck;
    delete registrationData.confirmPassword;
    this.authService
      .registerAsBuyer(registrationData)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.dismissModal(1);
          }
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

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  tncValidator(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.errors && !control.errors['tncValidator']) {
        return;
      }
      if (!control.value) {
        control.setErrors({ tncValidator: true });
      } else {
        control.setErrors(null);
      }
    };
  }

  phoneNumberValidator(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      if (control.errors && !control.errors['phoneNumber']) {
        return;
      }
      if (
        !control.value
          .toString()
          .match(
            /^(?:\+?\d{1,3}[- ]?)?\d{10}$|^(?:\+?\d{1,3}[- ]?)?\d{11}$|^(?:\+?\d{1,3}[- ]?)?\d{12}$|^(?:\+?\d{1,3}[- ]?)?\d{13}$/
          )
      ) {
        control.setErrors({ phoneNumber: true });
      } else {
        control.setErrors(null);
      }
    };
  }

  signInModal() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
  }
  dismissModal(message: any) {
    this.dialogRef.close(message);
  }
  allowOnlyNumbers(event: any) {
    if(event.key == '+') return;
    if(event.target.value.length >= 12) {
      event.preventDefault();
      return;
    }
    const keyCode = event.keyCode || event.which;

    // Keycodes for number keys (0-9) from the main keyboard (48-57)
    const isMainKeyboardNumber = keyCode >= 48 && keyCode <= 57;

    // Keycodes for number pad keys (0-9) (96-105)
    const isNumberPadKey = keyCode >= 96 && keyCode <= 105;

    // Allow backspace, delete, tab, arrow keys (keycodes 8, 46, 9, 37-40)
    const isControlKey = keyCode === 8 || keyCode === 46 || keyCode === 9 ||
                        (keyCode >= 37 && keyCode <= 40);

    if (!isMainKeyboardNumber && !isNumberPadKey && !isControlKey) {
      event.preventDefault();  // Prevent any other key input
    }
   }
  //dismissModal = (message: string) => this.activeModal.dismiss(message);
}
