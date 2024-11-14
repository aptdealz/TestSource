import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { AddGrievanceComponent } from 'src/app/shared/modals/add-grievance/add-grievance.component';
import { OrderStatus } from 'src/app/enums/order-status.enum';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BuyerService } from 'src/app/services/buyer.service';
import { OrderDetails } from 'src/app/models/orders.model';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-buyer-order-details',
  templateUrl: './buyer-order-details.component.html',
  styleUrls: ['./buyer-order-details.component.scss'],
})
export class BuyerOrderDetailsComponent implements OnInit, OnDestroy {
  private _location = inject(Location);
  private titleService = inject(Title);
  public route = inject(ActivatedRoute);
  public buyerService = inject(BuyerService);
  public qrCodeService = inject(QrCodeService);
  public page = inject(PageService);
  private dialog = inject(MatDialog);
  private ngUnsubscribe$ = new Subject<void>();
  pageTitle: string = 'Order Details';
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Order Details', path: '' },
  ];
  orderId: any;
  orderDetail!: OrderDetails;
  orderStatus: OrderStatus = OrderStatus.Pending;
  orderStatusList = [1, 2, 3, 4, 5, 6];
  qrCodeImage = 'assets/images/loading-qr.gif';
  loading = true;
  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.orderId = params['id'];
        this.getOrderDetails(this.orderId);
      },
      error: (err: any) => {
        this.loading = this.page.handleError(err);
      },
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getOrderStatusText(orderStatus: number): string {
    switch (orderStatus) {
      case 1:
        return 'Pending';
      case 2:
        return 'Accepted';
      case 3:
        return 'Ready For Pickup';
      case 4:
        return 'Shipped';
      case 5:
        return 'Delivered';
      case 6:
        return 'Completed';
      default:
        return '';
    }
  }
  setOrderStatus() {
    let orderSatusData: any[] = [];
    [1, 2, 3, 4, 5, 6].forEach((item) => {
      if (item == 3 && this.orderDetail?.pickupProductDirectly) {
        orderSatusData.push(item);
      } else if (
        (item == 4 || item == 5) &&
        !this.orderDetail?.pickupProductDirectly
      ) {
        orderSatusData.push(item);
      } else if (!(item == 3 || item == 4 || item == 5)) {
        orderSatusData.push(item);
      }
    });
    if (this.orderDetail.orderStatus === OrderStatus.Pending) {
      if (!this.orderDetail.pickupProductDirectly) {
        orderSatusData = [1, 2];
      } else {
        orderSatusData = [1, 2];
      }
    } else if (this.orderDetail.orderStatus === OrderStatus.Accepted) {
      if (!this.orderDetail.pickupProductDirectly) {
        orderSatusData = orderSatusData.filter((u) => u <= 4);
      } else if (this.orderDetail.pickupProductDirectly) {
        orderSatusData = orderSatusData.filter((u) => u <= 3);
      } else if (!this.orderDetail.pickupProductDirectly) {
        orderSatusData = orderSatusData.filter((u) => u <= 4);
      }
    } else if (this.orderDetail.orderStatus === OrderStatus.ReadyForPickup) {
      if (this.orderDetail.pickupProductDirectly) {
        orderSatusData = orderSatusData.filter(
          (u) => u >= this.orderDetail.orderStatus - 1 && u <= 6
        );
      }
    } else if (this.orderDetail.orderStatus === OrderStatus.Shipped) {
      orderSatusData = orderSatusData.filter(
        (u) => u >= this.orderDetail.orderStatus - 1 && u <= 5
      );
    } else if (this.orderDetail.orderStatus === OrderStatus.Delivered) {
      orderSatusData = orderSatusData.filter(
        (u) => u >= this.orderDetail.orderStatus - 1 && u <= 6
      );
    } else if (this.orderDetail.orderStatus === OrderStatus.Completed) {
      orderSatusData = orderSatusData.filter(
        (u) => u >= this.orderDetail.orderStatus - 1 && u <= 6
      );
    } else {
      orderSatusData = orderSatusData.filter(
        (u) => u >= this.orderDetail.orderStatus - 1 && u <= 6
      );
    }
    this.orderStatusList = orderSatusData;
  }
  getOrderDetails(id: any) {
  this.loading = this.page.showLoader(false);
    this.buyerService
      .getBuyerOrdersById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {

          this.orderDetail = res.data;
          this.orderStatus = this.orderDetail.orderStatus;
          this.setOrderStatus();
          if (this.orderStatus == OrderStatus.ReadyForPickup) {
            this.getGenerateQRCode(this.orderId);
          }
          this.loading = this.page.hideLoader();
        },
        error: (err: any) => {
         this.loading = this.page.handleError(err);
        },
      });
  }
  getGenerateQRCode = async (id: any) => {
    const imageData = await this.qrCodeService.getGenerateQRCodeImageById(id);
    this.qrCodeImage = imageData;
  }
  openUrl() {
   if(this.orderDetail.trackingLink.indexOf('https://')>=0){
      this.copyToClipboard(this.orderDetail.trackingLink);
    } else if(this.orderDetail.trackingLink.indexOf('http://')>=0){
      this.copyToClipboard(this.orderDetail.trackingLink);
    }else {
      this.copyToClipboard('https://' + this.orderDetail.trackingLink);
    } 
    
  }
  copyToClipboard(text: string) {
    const inputElement = document.createElement('textarea');
    inputElement.value = text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    this.page.showSuccessToast('Copy Succesfully');
  }
  back() {
    this._location.back();
  }
  raiseGrievance() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'grievance-dialog-lg';
    dialogConfig.data = {grievanceForId: this.orderDetail.orderId, grievanceForName: this.orderDetail.title};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(AddGrievanceComponent, {
      ...dialogConfig
    });
  }
  cancelOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: 'Are you sure you want to cancel this order?'};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
     (result) => {
        if (result == 'yes') {
          this.page.showLoader();
          this.buyerService
          .cancalOrderFromBuyer(this.orderId)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              //this.orderDetail = res.data;
              this.getOrderDetails(this.orderId);
              this.page.showSuccessToast('Order Cancelled Succesfully');
              this.page.hideLoader();
            },
            error: (err: any) => {
              this.page.showErrorToast('Some error occoured');
              this.page.handleError(err);
            },
          });
        }
      }
    );

  }
}
