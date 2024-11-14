import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { PageService } from 'src/app/services/page.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { SellerService } from 'src/app/services/seller.service';
import { OrderStatus } from 'src/app/enums/order-status.enum';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { Appointment } from 'src/app/shared/modals/scanner/appointment.model';
import { ISellerOrderUpdateModel } from './ISellerOrderUpdateModel';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-seller-order-details',
  templateUrl: './seller-order-details.component.html',
  styleUrls: ['./seller-order-details.component.scss'],
})
export class SellerOrderDetailsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Order Details', path: '' },
  ];
  pageTitle: string = 'Order Details';
  orderId: any;
  orderDetail!: any;
  scannerEnabled: boolean = false;
  allowedFormats = [BarcodeFormat.QR_CODE];
  @ViewChild('scanner')
  scanner!: ZXingScannerComponent;
  orderDetailForm: FormGroup | any;
  isOrderShipped = false;
  orderStatusEnumVal = OrderStatus;
  orderStatus: OrderStatus = OrderStatus.Pending;
  orderStatusList = [1, 2, 3, 4, 5, 6];
  information: string = 'Need to connect image input device';
  hasDevices: boolean = false;
  hasPermission: boolean = false;
  orderUpdate: ISellerOrderUpdateModel = <ISellerOrderUpdateModel>{};
  isLoading = false;
  availableDevices: MediaDeviceInfo[] = [];
  deviceSelected: string = '';
  deviceCurrent: MediaDeviceInfo | undefined;

  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private readonly fb: FormBuilder,
    private _location: Location,
    private titleService: Title,
    public page: PageService,
    public route: ActivatedRoute,
    public qrCodeService: QrCodeService,
    public sellerService: SellerService
  ) {
    this.orderDetailForm = this.fb.group({
      status: ['', Validators.required],
      shipperNumber: [''],
      lrNumber: [''],
      billNumber: [''],
      trackingLink: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.orderId = params['id'];
        this.getorderDetail();
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
  getorderDetail() {
     this.page.showLoader();
    this.sellerService
      .getSellerOrdersById(this.orderId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.page.hideLoader();
          this.orderDetail = res.data;
          this.orderStatus = this.orderDetail.orderStatus;
          this.setOrderStatus();
          this.updateOrderFormData();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  back() {
    this._location.back();
  }
  updateOrderFormData() {
    this.orderDetailForm.patchValue({
      status: this.orderDetail.orderStatus,
      shipperNumber: this.orderDetail.shipperNumber,
      lrNumber: this.orderDetail.lrNumber,
      billNumber: this.orderDetail.billNumber,
      trackingLink: this.orderDetail.trackingLink,
    });

    if (this.orderDetail.orderStatus === 4) {
      this.isOrderShipped = true;
    } else {
      this.isOrderShipped = false;
    }
  }

  get f() {
    return this.orderDetailForm?.controls;
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
  public camerasNotFoundHandler($event: any) {
    this.information = 'Camera not found, please make sure that camera permission is enabled.';
    this.hasDevices = false;
  }
  public scanSuccessHandler($event: any) {
    if (!this.scannerEnabled) return;
    this.information = 'Please wait while we are scanning... ';
    const appointment = new Appointment($event);
    if (appointment.identifier === null) {
      this.information =
        'No QR code information has been detected. Zoom in on a QR code to scan.';
      return;
    }
    if (appointment.identifier != this.orderDetail.orderId) {
      this.information =
        'Wrong QR Code, Please make sure that you are scanning correct QR Code.';
      this.page.showErrorToast(this.information);
      return;
    }
     this.page.showLoader();
    this.qrCodeService
      .scanQRandUpdateOrder({
        orderId: appointment.identifier
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (reponse: any) => {
          this.page.hideLoader();
          if (reponse.succeeded) {
            this.scannerEnabled = false;
            this.getorderDetail();
            this.page.showSuccessToast(reponse.message);
          } else {
            this.page.showErrorToast(reponse.message);
          }
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.information = '';
          this.page.handleError(err);
        },
      });
  }
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }
  onDeviceSelectChange(selected: any) {
    const selectedStr = selected.target.value || '';
    // if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selectedStr);
    this.deviceCurrent = device || undefined;
  }
  public enableScanner() {
    this.scannerEnabled = true;
    this.information =
      'No QR code information has been detected. Zoom in on a QR code to scan.';
  }
  camerasFoundHandler(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }
  openInfo() {
    this.page.showErrorToast('HasPermission: ' + this.hasPermission + 'HasDevices: ' + this.hasDevices + 'Selected Device: ' +this.deviceCurrent?.label);
  }
  onHasPermission(perm: boolean) {
    this.hasPermission = perm;
  }
  orderStatusChange(event: any) {
    if (event.target.value === '4') {
      this.isOrderShipped = true;
    } else {
      this.isOrderShipped = false;
      this.orderDetailForm.patchValue({
        shipperNumber: '',
        lrNumber: '',
        billNumber: '',
        trackingLink: '',
      });
    }
  }
  updateOrderDetails() {
    this.orderDetailForm?.updateValueAndValidity();
    if (this.orderDetailForm.valid) {
      this.isLoading = true;

      var formData = this.orderDetailForm.value;

      this.orderUpdate.orderId = this.orderId;
      this.orderUpdate.status = +formData.status;
      this.orderUpdate.shipperNumber = formData.shipperNumber;
      this.orderUpdate.lrNumber = formData.lrNumber;
      this.orderUpdate.billNumber = formData.billNumber;
      this.orderUpdate.trackingLink = formData.trackingLink;
       this.page.showLoader();
      this.sellerService
        .updateOrderDetails(this.orderUpdate)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (reponse: any) => {
            this.isLoading = false;
            this.page.hideLoader();
            if (reponse.succeeded) {
              this.page.showSuccessToast(reponse.message);
              this.getorderDetail();
            } else {
              this.page.showErrorToast(reponse.message, 'Error');
            }
          },
          error: (err: any) => {
            this.page.hideLoader();
            this.isLoading = false;
            this.page.handleError(err);
          },
        });
    }
  }
}
