import { Component, Input,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-handle',
  templateUrl: './error-handle.component.html',
  styleUrls: ['./error-handle.component.scss'],
})
export class ErrorHandleComponent {
  /* @Input() text: any;
  @Input() title: any; */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ErrorHandleComponent>) {}

  ngOnInit(): void {}
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
  
  //dismissModal = (message: string) => this.activeModal.dismiss(message);
}
