import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seller-registration-success',
  templateUrl: './seller-registration-success.component.html',
  styleUrls: ['./seller-registration-success.component.scss'],
})
export class SellerRegistrationSuccessComponent {
  constructor(
    public router: Router,
    public dialog: MatDialog,
  public dialogRef: MatDialogRef<SellerRegistrationSuccessComponent>
  ) {}

  navigateToHome() {
    this.dismissModal('close');
    this.router.navigateByUrl('/home');
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
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
  
 // dismissModal = (message: string) => this.activeModal.dismiss(message);
}
