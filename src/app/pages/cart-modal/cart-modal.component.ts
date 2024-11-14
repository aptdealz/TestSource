import { Component, Input ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent {
/*   @Input() item: any; */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CartModalComponent>) {}
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
  
 // dismissModal = (message: string) => this.activeModal.dismiss(message);
}
