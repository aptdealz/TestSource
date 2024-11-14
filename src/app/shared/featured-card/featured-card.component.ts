import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SendEnquiryComponent } from '../modals/send-enquiry/send-enquiry.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-featured-card',
  templateUrl: './featured-card.component.html',
  styleUrls: ['./featured-card.component.scss'],
})
export class FeaturedCardComponent implements OnInit {
  @Input() item: any;
  constructor(
    public dialog: MatDialog,
    public auth:AuthService) {}

  ngOnInit(): void {}

  sendEnquiry() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'enquiry-dialog';
    dialogConfig.data = {item: this.item};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SendEnquiryComponent, {
      ...dialogConfig
    });
  }
  getRating(item: any) {
    return;
  }
}
