import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { CongratsPopupComponent } from 'src/app/shared/modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { SendQuotesComponent } from 'src/app/shared/modals/send-quotes/send-quotes.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { environment } from 'src/environments/environment';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { RequirementService } from 'src/app/services/requirement.service';
import { BuyerService } from 'src/app/services/buyer.service';
import { RequirementDetail } from 'src/app/models/requirement.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/shared/modals/success-popup/success-popup.component';
declare let Razorpay: any;

@Component({
  selector: 'app-requirement-details',
  templateUrl: './requirement-details.component.html',
  styleUrls: ['./requirement-details.component.scss'],
})
export class RequirementDetailsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Requirements', path: '/requirement-list' },
    { title: 'Details', path: '' },
  ];
  list!: RequirementDetail;
  id: any;
  isShowDeleteButton: boolean = false;
  pageTitle: string = 'Requirement Details';
  private ngUnsubscribe$ = new Subject<void>();
  paymentData: any = null;
  buyerContact: string = '';
  RAZORPAY_OPTIONS = {
    key: environment.razorPayKey,
    key_id: environment.razorPayKey,
    key_secret: environment.razorPaySecret,
    amount: '',
    name: 'Quotesouk',
    order_id: '',
    description: 'Reveal Buyer Contact Payment',
    // "image": `${environment.WebUrl}/assets/img/logo_main.png`,
    prefill: {
      name: '',
      email: '',
      contact: '',
      method: '',
    },
    handler: (response: any) => {
      this.successPayment(response);
    },
    modal: {},
    // "theme": {
    //   "color": "#0096C5"
    // }
  };
  loading = true;
  constructor(
    private _location: Location,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public page: PageService,
    private roleService: RoleService,
    private userService: UserService,
    private titleService: Title,
    private buyerService: BuyerService,
    private requirementService: RequirementService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.id = params['id'];
        this.getData();
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
  openQuote() {
    this.dialog.closeAll();
    if (this.roleService.isBuyer()) {
      let message =
        'You are currently logged in as buyer. If you want to submit quote please login as a seller';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = {text: message, title: title};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig
        });
      
        dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_seller') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.data = {isSeller: 'seller'};
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          this.router.navigateByUrl('/become-vendor');
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'quote-dialog-lg';
      dialogConfig.data = {requirementId: this.id, 
        pickupProductDirectly: this.list.pickupProductDirectly, 
        needInsuranceCoverage: this.list.needInsuranceCoverage, 
        quantity: this.list.quantity};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(SendQuotesComponent, {
        ...dialogConfig
      });
    }
  }
  back() {
    this._location.back();
  }

  getData() {
    const userId = this.userService.getUserId();
    this.loading = this.page.showLoader(false);
    this.requirementService
      .getRequirementById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.list = res.data;
            this.isShowDeleteButton = this.list.userId === userId;

            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Requirement details not found.'
            );
          }
        },
        error: (err: any) => {
          this.loading = this.page.handleError(err);
        },
      });
  }

  delete() {
    let message = 'Are you sure you want to delete this requirement?';
   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
       (result) => {
        if (result == 'yes') {
           this.page.showLoader();
          this.requirementService
            .deleteRequirement(this.id)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                if (res.message) {
                  this.page.showSuccessToast(res.message);
                  this.router.navigateByUrl('/requirement-list');
                } else if (res.errors) {
                  this.page.showErrorToast(res.errors.join('<br>'));
                }
               this.page.hideLoader();
              },
              error: (err: any) => {
               this.page.hideLoader();
                this.page.showErrorToast(err);
                this.page.handleError(err);
              },
            });
        }
      }
    );
  }
  successPayment(response: any) {
   // this.page.showSuccessToast('Payment Completed.');
    this.showPaymentSuccessPopup();
    this.revealContact(response);
  }
  showPaymentSuccessPopup(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'success-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      ...dialogConfig
    });
  }
  revealContact(response: any) {
    let RevealBuyerContactRequest: any = {
      requirementId: this.id,
      paymentStatus: 2,
      razorPayOrderId: response?.razorpay_order_id??'',
      razorPaySignature: response?.razorpay_signature??'',
      razorPayPaymentId: response?.razorpay_payment_id??'',
    };
     this.page.showLoader();
    this.buyerService.revealBuyerContact(RevealBuyerContactRequest).subscribe({
      next: (reponse) => {
        if (reponse.succeeded) {
          this.getData();
          this.buyerContact = reponse.data.phoneNumber;
        } else {
          this.page.showErrorToast(reponse.message);
        }
       this.page.hideLoader();
      },
      error: (err: any) => {
       this.page.hideLoader();
        this.page.showErrorToast(err ?? 'Server Error occured');
        this.page.handleError(err);
      },
    });
  }
  completePayment() {
     this.page.showLoader();
    this.buyerService.createOrderForRevealBuyerContact().subscribe({
      next: (reponse) => {
       this.page.hideLoader();
        if (reponse.succeeded) {
          this.paymentData = reponse.data;
          if (this.paymentData.orderId !== '') {
            this.RAZORPAY_OPTIONS.amount = (
              parseFloat(this.paymentData.amount) * 100
            ).toString();
            this.RAZORPAY_OPTIONS.order_id = this.paymentData.orderId;
            this.RAZORPAY_OPTIONS.prefill.name = this.paymentData.name;
            this.RAZORPAY_OPTIONS.prefill.email = this.paymentData.email;
            this.RAZORPAY_OPTIONS.prefill.contact =
              this.paymentData.phoneNumber;
              if(environment.disablePayment){
                this.revealContact(null);
              }else{
                let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
                razorpay.open();
                razorpay.on('payment.failed', (response: any) => {
                  this.page.showErrorToast('Payment Failed.!');
                });
              }
          }
        } else {
          this.page.showErrorToast(reponse.message);
        }
      },
      error: (err: any) => {
       this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
}
