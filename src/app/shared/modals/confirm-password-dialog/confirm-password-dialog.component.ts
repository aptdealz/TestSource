import { Component, Input, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef,MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-password-dialog.component.html',
  styleUrls: ['./confirm-password-dialog.component.scss'],
})
export class ConfirmPasswordDialogComponent implements OnInit {
  passwordForm!:FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public fb: FormBuilder,
  public dialogRef: MatDialogRef<ConfirmPasswordDialogComponent>) {}

  ngOnInit(): void {
   this.passwordForm = this.fb.group({
     password: [null,Validators.required]
    })
  }
  closeDialog(message: string) {
    console.log(this.passwordForm.value.password)
    if(message == 'yes'){
      this.dialogRef.close({message:message,password:this.passwordForm.value.password});
    }
    else{
      this.dialogRef.close({message:message});
    }
  }
}
