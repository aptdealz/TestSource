import { Component, Input, OnDestroy, OnInit, inject,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { PageService } from 'src/app/services/page.service';
import { RoleService } from 'src/app/services/role.service';
import { GrievanceType, GrievancesTypes } from 'src/app/models/grievance.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { Orders } from 'src/app/models/orders.model';
import { GrievanceService } from 'src/app/services/grievance.service';
import { SellerService } from 'src/app/services/seller.service';
import { ResponseModel } from 'src/app/models/generic/response.model';
import { FileUploadRequest } from 'src/app/models/file-upload.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-grievance',
  templateUrl: './add-grievance.component.html',
  styleUrls: ['./add-grievance.component.scss'],
})
export class AddGrievanceComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private buyerService = inject(BuyerService);
  private sellerService = inject(SellerService);
  private grievanceService = inject(GrievanceService);
  public dialogRef= inject(MatDialogRef<AddGrievanceComponent>);
/*   @Input() grievanceForId = '';
  @Input() grievanceForName = ''; */
  grievanceType: GrievanceType[] = GrievancesTypes;
  orders: Orders[] = [];
  documents: any = [];
  form: any;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit() {
    this.form = this.fb.group({
      orderId: [null, [Validators.required]],
      grievanceType: [0, [Validators.required]],
      issueDescription: [null, [Validators.required]],
      preferredSolution: [null, [Validators.required]],
      documents: [null],
    });
    if (this.roleService.isBuyer()) {
      this.buyerService
        .getBuyerOrders()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.orders = res.data;
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    } else {
      this.sellerService
        .getSellerOrders()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.orders = res.data;
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    }

    if (this.data && this.data?.grievanceForId) {
      this.f.orderId.patchValue(this.data.grievanceForId);
    }
  }
  get isValid() {
    console.log(this.form.invalid)
    return this.form.invalid;
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  get f() {
    return this.form.controls;
  }

  async onFilesUploaded(event: any) {
    const files = event.target.files;
    this.documents = [];
    for (const file of files) {
      let binary = await this.fileToBinaryString(file);
      this._handleReaderLoadedDoc(binary, file.name);
    }
  }

  fileToBinaryString(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const binaryString = event.target?.result as string;
        resolve(binaryString);
      };

      reader.onerror = () => {
        reject('Unable to read file');
      };

      reader.readAsBinaryString(file);
    });
  }
  async _handleReaderLoadedDoc(binary: any, filename: any) {
    const request: FileUploadRequest = {
      base64String: btoa(binary),
      fileName: filename,
      fileUploadCategory: 1,
    };
    this.uploadService
      .uploadFile(request)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (data) => {
          if (data.succeeded) {
            this.documents.push(data.data.fileUri);
            this.f.documents.patchValue(this.documents);
          } else {
            this.page.showErrorToast(data.message);
          }
        },
        error: (err: any) => {
          this.page.showErrorToast('Some error occoured');
          this.page.handleError(err);
        },
      });
  }

  save() {
    let call: any;
     this.page.showLoader();
    if (this.roleService.isBuyer()) {
      const grievanceData = this.form.value;
      if (this.data.grievanceForId) {
        grievanceData.orderId = this.data.grievanceForId;
      }
      call = this.grievanceService.addBuyerGrievance(this.form.value);
    } else {
      call = this.grievanceService.addSellerGrievance(this.form.value);
    }
    call.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: ResponseModel<string>) => {
        if (res.succeeded) {
          this.page.showSuccessToast(res.message, '');
          this.dismissModal('save');
        } else {
          this.page.showErrorToast('Some Error Occoured', '');
        }
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.showErrorToast('Some Error Occoured', '');
        this.page.handleError(err);
      },
    });
  }
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }

 /*  dismissModal = (message: string) => this.activeModal.dismiss(message); */
}
