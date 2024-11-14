import { Component, OnInit, Input ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-congrats-popup',
  templateUrl: './congrats-popup.component.html',
  styleUrls: ['./congrats-popup.component.scss'],
})
export class CongratsPopupComponent implements OnInit {
/*   @Input() title: any;
  @Input() text: any;
  @Input() isBuyer: boolean = false; */
  constructor(
    public dialogRef: MatDialogRef<CongratsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  ngOnInit(): void {}
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
 // dismissModal = (message: string) => this.activeModal.dismiss(message);
}
