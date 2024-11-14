import { Component, OnInit } from '@angular/core';
import { CheckoutCongratsComponent } from '../checkout-congrats/checkout-congrats.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-billing-confirm',
  templateUrl: './billing-confirm.component.html',
  styleUrls: ['./billing-confirm.component.scss'],
})
export class BillingConfirmComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BillingConfirmComponent>
  ) {}

  ngOnInit(): void {}

  checkoutModal() {
    this.dialog.closeAll();
  /*   const modalRef = this.modalService.open(CheckoutCongratsComponent, {
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
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
 /*  dismissModal = (message: string) => this.activeModal.dismiss(message); */
}
