import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-checkout-congrats',
  templateUrl: './checkout-congrats.component.html',
  styleUrls: ['./checkout-congrats.component.scss'],
})
export class CheckoutCongratsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CheckoutCongratsComponent>) {}
  ngOnInit(): void {}
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
 /*  dismissModal = (message: string) => this.activeModal.dismiss(message); */
}
