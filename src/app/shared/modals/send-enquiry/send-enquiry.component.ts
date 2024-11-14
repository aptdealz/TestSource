import { Component, Input, OnDestroy, OnInit, Inject,inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CheckoutCongratsComponent } from '../checkout-congrats/checkout-congrats.component';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { RoleService } from 'src/app/services/role.service';
import { CongratsPopupComponent } from '../congrats-popup/congrats-popup.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { BuyerService } from 'src/app/services/buyer.service';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.component.html',
  styleUrls: ['./send-enquiry.component.scss'],
})
export class SendEnquiryComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private buyerService = inject(BuyerService);
  private enquiryService = inject(EnquiryService);
  private dialog = inject(MatDialog);

  /* @Input('item') item: any; */
  enquiryForm: any;
  profileData: any;
  private ngUnsubscribe$ = new Subject<void>();
 constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SendEnquiryComponent>){}
  ngOnInit() {
    if (!this.authService.isLoggedIn) {
      this.dialog.closeAll();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig
      });
    } else {
      if (this.roleService.isSeller()) {
        this.dialog.closeAll();
        let message =
          'You are currently logged in as seller. If you want to submit quote please login as a buyer';
        let title = 'Access Denied';
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = {text: message,isBuyer:true, title: title};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig
        });

        /* const modalRef = this.modalService.open(CongratsPopupComponent, {
          size: 'lg',
          centered: true,
        });
        modalRef.componentInstance.text = message;
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.isBuyer = true; */
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
      }
    }

    this.enquiryForm = this.fb.group({
      sellerProductId: [this.data.item.sellerProductId],
      name: ['', Validators.required],
      quantity: [1, Validators.required],
      phoneNumber: ['', Validators.required],
      description: ['', Validators.required],
      shippingAddress: [''],
    });
    this.buyerService
      .getBuyerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.profileData = res.data;
          this.enquiryForm.patchValue({
            name: this.profileData.fullName ?? '',
            phoneNumber: this.profileData.phoneNumber ?? '',
          });
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
  checkoutModal() {
    this.dialog.closeAll();
 /*    const modalRef = this.modalService.open(CheckoutCongratsComponent, {
      windowClass: 'myCustomModalClass',
      centered: true,
    }); */
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'congrats-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(CheckoutCongratsComponent, {
      ...dialogConfig
    });
  }
  get f() {
    return this.enquiryForm.controls;
  }

  onQuantityDecrement() {
    let value = this.f.quantity.value - 1;
    if (value > 0) {
      this.f.quantity.setValue(value);
    }
  }

  onQuantityIncrement() {
    let value = this.f.quantity.value + 1;
    this.f.quantity.setValue(value);
  }

  submit() {
    if (this.enquiryForm.valid) {
      this.enquiryService
        .postEnquiry(this.enquiryForm.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.page.showSuccessToast('Enquiry Created Successfully.');
            this.enquiryForm.reset();
            this.checkoutModal();
          },
          error: (err: any) => {
            this.page.showErrorToast(err?.error?.message);
            this.page.handleError(err);
          },
        });
    }
  }
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
  allowPhoneNumberOnlyNumbers(event: any) {
    if(event.key == '+') return;
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
