import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { PageService } from 'src/app/services/page.service';
import { CheckoutCongratsComponent } from 'src/app/shared/modals/checkout-congrats/checkout-congrats.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { CountryResponse } from 'src/app/models/country.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { AddressService } from 'src/app/services/address.service';
import { CountryState } from 'src/app/models/state.model';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Checkout', path: '/checkout' },
    { title: 'Order Complete', path: '' },
  ];
  checkoutForm!: FormGroup;
  pageTitle: string = 'Checkout';
  countries: CountryResponse = [];
  statesB: CountryState[] = [];
  statesC: CountryState[] = [];
  shipping_address_same_as_billing = false;
  isReseller: boolean = false;
  profileData!: BuyerResponse;
  private ngUnsubscribe$ = new Subject<void>();
  isBillingPinCodeChanged = false;
  selectedBillingStateFromPincode = '';

  isShippingPinCodeChanged = false;
  selectedShippingStateFromPincode = '';


  constructor(
    private titleService: Title,
    private readonly fb: FormBuilder,
    private page: PageService,
    public router: Router,
    public cartService: CartService,
    public buyerService: BuyerService,
    public addressService: AddressService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.checkoutForm = this.fb.group({
      gstin: [this.cartService.cart.gstin],
      isReseller: [this.cartService.cart.isReseller],
      agreeGSTc: [this.cartService.cart.agreeGSTc],
      billingAddressBuilding: ['', Validators.required],
      billingAddressCountry: ['', Validators.required],
      billingAddressCity: ['', Validators.required],
      billingAddressName: ['', Validators.required],
      billingAddressState: ['', Validators.required],
      billingAddressStreet: ['', Validators.required],
      billingAddressPinCode: ['', Validators.required],
      billingAddressLandmark: ['', Validators.required],
      shippingAddressStreet: ['', Validators.required],
      shippingAddressCountry: ['', Validators.required],
      shippingAddressState: ['', Validators.required],
      shippingAddressPinCode: ['', Validators.required],
      shippingAddressName: ['', Validators.required],
      shippingAddressCity: ['', Validators.required],
      shippingAddressBuilding: ['', Validators.required],
      shippingAddressLandmark: ['', Validators.required],
    });
    this.getCountries();
    this.checkoutForm?.get('billingAddressCountry')?.valueChanges.subscribe({
      next: (value: any) => {
        this.getStatesByBilling(value);
      },
    });
    this.checkoutForm?.get('shippingAddressCountry')?.valueChanges.subscribe({
      next: (value: any) => {
        this.getStatesByShipping(value);
      },
    });

    this.buyerService
      .getBuyerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.profileData = res.data;
          this.checkoutForm.patchValue({
            billingAddressBuilding: this.profileData?.building,
            billingAddressCity: this.profileData?.city,
            billingAddressName: this.profileData?.fullName,
            billingAddressState: this.profileData?.state,
            billingAddressStreet: this.profileData?.street,
            billingAddressPinCode: this.profileData?.pinCode,
            billingAddressLandmark: this.profileData?.landmark,
            billingAddressCountry: this.profileData?.countryId,
          });
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
  getCountries() {
     this.page.showLoader();
    this.addressService
      .getCountries()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.countries = response;
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  getStatesByBilling(id: any) {
    if (!id) {
      this.statesB = [];
      return;
    }
    this.addressService
      .getStatesByCountryId(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.statesB = response;
          if (this.isBillingPinCodeChanged) {
            this.f.billingAddressState.setValue(this.selectedBillingStateFromPincode);
            this.isBillingPinCodeChanged = false;
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  getStatesByShipping(id: any) {
    if (!id) {
      this.statesC = [];
      return;
    }
    this.addressService
      .getStatesByCountryId(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.statesC = response;
          if (this.isShippingPinCodeChanged) {
            this.f.shippingAddressState.setValue(this.selectedShippingStateFromPincode);
            this.isShippingPinCodeChanged = false;
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  checkoutModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'congrats-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(CheckoutCongratsComponent, {
      ...dialogConfig
    });
  }
sameBilling(){
  if (this.shipping_address_same_as_billing) {
    this.checkoutForm.patchValue({
      shippingAddressCountry: this.checkoutForm.value.billingAddressCountry,
      shippingAddressBuilding: this.checkoutForm.value.billingAddressBuilding,
      shippingAddressCity: this.checkoutForm.value.billingAddressCity,
      shippingAddressName: this.checkoutForm.value.billingAddressName,
      shippingAddressState: this.checkoutForm.value.billingAddressState,
      shippingAddressStreet: this.checkoutForm.value.billingAddressStreet,
      shippingAddressPinCode: this.checkoutForm.value.billingAddressPinCode,
      shippingAddressLandmark: this.checkoutForm.value.billingAddressLandmark,
    });
  }
}
  placeOrder() {

    if (this.checkoutForm.valid) {
      this.buyerService
        .placeOrder(this.checkoutForm.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            if(res.succeeded){
              this.cartService.syncCart();
              this.router.navigateByUrl('/');
              this.checkoutModal();
              this.checkoutForm.reset();
            }
            else{
              this.page.showErrorToast(res.message)
            }

          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    } else {
      this.page.showErrorToast('Please fill all the fields correctly');
    }
  }

  get f() {
    return this.checkoutForm.controls;
  }
  allowOnlyNumbers(event: any) {
    if (!(event.code.toLowerCase() == 'delete' || event.code.toLowerCase() == 'backspace' || event.code.toLowerCase() == 'tab') && event.target.value.length >= 6) {
      event.preventDefault();
      return;
    }
    const keyCode = event.keyCode || event.which;

    // Keycodes for number keys (0-9) from the main keyboard (48-57)
    const isMainKeyboardNumber = keyCode >= 48 && keyCode <= 57;

    // Keycodes for number pad keys (0-9) (96-105)
    const isNumberPadKey = keyCode >= 96 && keyCode <= 105;

    // Allow backspace, delete, tab, arrow keys (keycodes 8, 46, 9, 37-40)
    const isControlKey = keyCode === 8 || keyCode === 46 || keyCode === 9 ||
                        (keyCode >= 37 && keyCode <= 40);

    if (!isMainKeyboardNumber && !isNumberPadKey && !isControlKey) {
      event.preventDefault();  // Prevent any other key input
    }
   }
   pincodeChangeBilling() {
    if (this.f.billingAddressPinCode.valid && (this.f.billingAddressPinCode.value.toString().length === 6)) {
      this.addressService.getDataFromPinCode(this.f.billingAddressPinCode.value).subscribe({
        next: (res) => {
          if (res.succeeded) {
            let data: any = res.data;
            let country:any = this.countries.find(ele => ele.name == data.country);
            this.f.billingAddressCountry.setValue(country.countryId);
            this.f.billingAddressCity.setValue(res.data.division);
            this.selectedBillingStateFromPincode = res.data.state;
            this.isBillingPinCodeChanged = true;
            this.getStatesByBilling(country.countryId);
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    }
  }
  pincodeChangeShipping() {
    if (this.f.shippingAddressPinCode.valid && (this.f.shippingAddressPinCode.value.toString().length === 6)) {
      this.addressService.getDataFromPinCode(this.f.shippingAddressPinCode.value).subscribe({
        next: (res) => {
          if (res.succeeded) {
            let data: any = res.data;
            let country:any = this.countries.find(ele => ele.name == data.country);
            this.f.shippingAddressCountry.setValue(country.countryId);
            this.f.shippingAddressCity.setValue(res.data.division);
            this.selectedShippingStateFromPincode = res.data.state;
            this.isShippingPinCodeChanged = true;
            this.getStatesByShipping(country.countryId);
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    }
  }
}
