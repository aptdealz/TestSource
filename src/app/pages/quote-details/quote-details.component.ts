import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RoleService } from 'src/app/services/role.service';
import { BuyerService } from 'src/app/services/buyer.service';
import { QuotesService } from 'src/app/services/quotes.service';
import { QuoteDetail } from 'src/app/models/quote.model';
import { SellerService } from 'src/app/services/seller.service';
import { PaymentService } from 'src/app/services/payment.service';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { SuccessPopupComponent } from 'src/app/shared/modals/success-popup/success-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
declare let Razorpay: any;
@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss'],
})
export class QuoteDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private _location = inject(Location);
  private titleService = inject(Title);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private buyerService = inject(BuyerService);
  private quotesService = inject(QuotesService);
  private sellerService = inject(SellerService);
  private paymentService = inject(PaymentService);
  private dialog = inject(MatDialog);
  isBuyer = this.roleService.isBuyer();
  isSeller = this.roleService.isSeller();

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Quotes', path: '' },
    { title: 'Quotes Details', path: '' },
  ];
  list!: QuoteDetail;
  buyerContact: any = {
    UserId: '',
    BuyerId: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
  };
  sellerContact: any = {
    UserId: '',
    SellerId: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
  };
  paymentData!: any;
  pageTitle: string = 'Quote';
  RAZORPAY_OPTIONS = {
    key: environment.razorPayKey,
    key_id: environment.razorPayKey,
    key_secret: environment.razorPaySecret,
    amount: '',
    name: 'Quotesouk',
    order_id: '',
    description: 'Accept Quote',
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

  RAZORPAY_OPTIONS_RevealBuyerContact = {
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
      this.successPaymentRevealContact(response);
    },
    modal: {},
    // "theme": {
    //   "color": "#0096C5"
    // }
  };

  RAZORPAY_OPTIONS_RevealSellerContact = {
    key: environment.razorPayKey,
    key_id: environment.razorPayKey,
    key_secret: environment.razorPaySecret,
    amount: '',
    name: 'Quotesouk',
    order_id: '',
    description: 'Reveal Seller Contact Payment',
    // "image": `${environment.WebUrl}/assets/img/logo_main.png`,
    prefill: {
      name: '',
      email: '',
      contact: '',
      method: '',
    },
    handler: (response: any) => {
      this.successPaymentSellerRevealContact(response);
    },
    modal: {},
    // "theme": {
    //   "color": "#0096C5"
    // }
  };
  profileData!: BuyerResponse;
  private ngUnsubscribe$ = new Subject<void>();
  quoteId = '';
  loading = true;
  ngOnInit() {
    if (this.isBuyer) {
      this.breadcrumbs[1].path = '/buyer-profile/quotes';
      this.buyerService
        .getBuyerProfile()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.profileData = res.data;
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    }
    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.quoteId = params['id'];
        this.getQuote(this.quoteId);
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
  successPayment(response: any) {
    let data;
    if(environment.disablePayment) {
      data = {
        orderId: this.paymentData.orderId,
        razorPayOrderId: this.paymentData.razorpayOrderId,
        razorPayPaymentId: '',
        paymentStatus: 2,
        razorpaySignature: '',
      };
    } else {
      data = {
        orderId: this.paymentData.orderId,
        razorPayOrderId: this.paymentData.razorpayOrderId,
        razorPayPaymentId: response.razorpay_payment_id,
        paymentStatus: 2,
        razorpaySignature: response.razorpay_signature,
      };
    }
    this.page.hideLoader();
    this.paymentService
      .createPayment(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.page.hideLoader();
          this.getQuote(this.list?.quoteId);
          if(environment.disablePayment) {
            this.page.showSuccessToast('Order placed successfully');
          } else {
            this.showPaymentSuccessPopup();
          }
         // this.page.showSuccessToast('Payment successfully');
        },
        error: (err: any) => {
          this.page.showErrorToast('Error Occoured');
          this.page.handleError(err);
        },
      });
  }
  getQuote(id: any) {
    this.loading = true;
    this.page.hideLoader();
    this.quotesService
      .getQuotesById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.page.hideLoader();
          if (res.succeeded) {
          this.list = res.data;
          if(!this.isBuyer){
            this.breadcrumbs[1].path = `/seller-requirement-details/${this.list.requirementId}`;
          }
        } else {
          this.loading = false;
          this.page.showLoader(false, 'Quote details not found.');
          this.page.hideLoader();
        }
        },
        error: (err: any) => {
          this.loading = false;
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  back() {
    this._location.back();
  }
  confirmPayment(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: 'Are you sure you want to accept this quote?'};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
     (result) => {
      if (result == 'yes') {
  this.completePayment()
      }
     })
  }
  rejectPayment(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: 'Are you sure you want to reject this quote?'};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
     (result) => {
      if (result == 'yes') {
  this.rejectQuote()
      }
     })
  }
  completePayment() {
     this.page.showLoader();
    this.paymentService
      .createRazorpayOrder({
        quoteId: this.list?.quoteId,
        paidAmount: this.list?.totalQuoteAmount,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (reponse) => {
          if (reponse.succeeded) {
            this.paymentData = reponse.data;
            if (this.paymentData.orderId !== '') {
              this.RAZORPAY_OPTIONS.amount = (
                this.list.totalQuoteAmount * 100
              ).toString();
              this.RAZORPAY_OPTIONS.order_id = this.paymentData.razorpayOrderId;
              this.RAZORPAY_OPTIONS.prefill.name = this.profileData.fullName;
              this.RAZORPAY_OPTIONS.prefill.email = this.profileData.email;
              this.RAZORPAY_OPTIONS.prefill.contact =
                this.profileData.phoneNumber;

              if(environment.disablePayment) {
                this.successPayment(null);
              } else {
                let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
                razorpay.open();
                razorpay.on('payment.failed', (response: any) => {
                  this.page.showErrorToast('Payment Failed!');
                });
              }
              this.page.hideLoader();
            }
          } else {
            this.page.showErrorToast('Some Error Occoured');
            this.page.hideLoader();
          }
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.showErrorToast('Some Error Occoured');
          this.page.handleError(err);
        },
      });
  }

  rejectQuote() {
    this.quotesService
      .rejectQuote(this.list?.quoteId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.getQuote(this.list?.quoteId);
          this.page.showSuccessToast('Quote Rejected Successfully');
        },
        error: (err: any) => {
          this.page.showErrorToast('Some Error Occoured');
          this.page.handleError(err);
        },
      });
  }
  successPaymentRevealContact(response: any) {
   // this.page.showSuccessToast('Payment Completed.!');
    this.page.hideLoader();
    this.showPaymentSuccessPopup();
    this.revealBuyerContact(response);
  }
  showPaymentSuccessPopup(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'success-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      ...dialogConfig
    });
  }
  revealBuyerContact(response: any) {
    let revealBuyerContactRequest = null;
    if(environment.disablePayment) {
      revealBuyerContactRequest = {
        requirementId: this.list?.requirementId,
        paymentStatus: 2,
        razorPayOrderId: '',
        razorPaySignature: '',
        razorPayPaymentId: '',
      };
    } else {
      revealBuyerContactRequest = {
        requirementId: this.list?.requirementId,
        paymentStatus: 2,
        razorPayOrderId: response.razorpay_order_id,
        razorPaySignature: response.razorpay_signature,
        razorPayPaymentId: response.razorpay_payment_id,
      };
    }
    this.page.hideLoader();
    this.buyerService.revealBuyerContact(revealBuyerContactRequest).subscribe({
      next: (reponse) => {
        if (reponse.succeeded) {
          this.getQuote(this.quoteId);
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
  createOrderForRevealBuyerContact() {
     this.page.showLoader();
    this.buyerService.createOrderForRevealBuyerContact().subscribe({
      next: (reponse) => {
        this.page.hideLoader();
        if (reponse.succeeded) {
          this.paymentData = reponse.data;
          if (this.paymentData.orderId !== '') {
            this.RAZORPAY_OPTIONS_RevealBuyerContact.amount = (
              parseFloat(this.paymentData.amount) * 100
            ).toString();
            this.RAZORPAY_OPTIONS_RevealBuyerContact.order_id =
              this.paymentData.orderId;
            this.RAZORPAY_OPTIONS_RevealBuyerContact.prefill.name =
              this.paymentData.name;
            this.RAZORPAY_OPTIONS_RevealBuyerContact.prefill.email =
              this.paymentData.email;
            this.RAZORPAY_OPTIONS_RevealBuyerContact.prefill.contact =
              this.paymentData.phoneNumber;
            if(environment.disablePayment) {
              this.revealBuyerContact(null);
            } else {
              let razorpay = new Razorpay(
                this.RAZORPAY_OPTIONS_RevealBuyerContact
              );
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

  // Seller contact reveal
  successPaymentSellerRevealContact(response: any) {
   // this.page.showSuccessToast('Payment Completed.!');
    this.page.hideLoader();
    this.showPaymentSuccessPopup()
    this.revealSellerContact(response);
  }
  revealSellerContact(response: any) {
   let revealBuyerContactRequest;
    if(environment.disablePayment) {
      revealBuyerContactRequest = {
        quoteId: this.list?.quoteId,
        paymentStatus: 2,
        razorPayOrderId: '',
        razorPaySignature: '',
        razorPayPaymentId: '',
      };
    } else {
      revealBuyerContactRequest = {
        quoteId: this.list?.quoteId,
        paymentStatus: 2,
        razorPayOrderId: response.razorpay_order_id,
        razorPaySignature: response.razorpay_signature,
        razorPayPaymentId: response.razorpay_payment_id,
      };
    }
    this.page.hideLoader();
    this.sellerService
      .revealSellerContact(revealBuyerContactRequest)
      .subscribe({
        next: (reponse) => {
          this.page.hideLoader();
          if (reponse.succeeded) {
            this.buyerContact = reponse.data.phoneNumber;
            this.getQuote(this.quoteId);
          } else {
            this.page.showErrorToast(reponse.message);
          }
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.showErrorToast(err ?? 'Server Error occured');
          this.page.handleError(err);
        },
      });
  }
  createOrderForRevealSellerContact() {
     this.page.showLoader();
    this.sellerService.createOrderForRevealSellerContact().subscribe({
      next: (reponse: any) => {
        this.page.hideLoader();
        if (reponse.succeeded) {
          this.paymentData = reponse.data;
          if (this.paymentData.orderId !== '') {
            this.RAZORPAY_OPTIONS_RevealSellerContact.amount = (
              parseFloat(this.paymentData.amount) * 100
            ).toString();
            this.RAZORPAY_OPTIONS_RevealSellerContact.order_id =
              this.paymentData.orderId;
            this.RAZORPAY_OPTIONS_RevealSellerContact.prefill.name =
              this.paymentData.name;
            this.RAZORPAY_OPTIONS_RevealSellerContact.prefill.email =
              this.paymentData.email;
            this.RAZORPAY_OPTIONS_RevealSellerContact.prefill.contact =
              this.paymentData.phoneNumber;

            if(environment.disablePayment) {
              this.revealSellerContact(null);
            } else {
              let razorpay = new Razorpay(
                this.RAZORPAY_OPTIONS_RevealSellerContact
              );
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
