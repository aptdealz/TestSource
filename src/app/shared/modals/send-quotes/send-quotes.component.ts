import { Component, Input, OnDestroy, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { PageService } from 'src/app/services/page.service';
import { CountryResponse } from 'src/app/models/country.model';
import { QuotesService } from 'src/app/services/quotes.service';
import { AddressService } from 'src/app/services/address.service';
import { CountryState } from 'src/app/models/state.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-quotes',
  templateUrl: './send-quotes.component.html',
  styleUrls: ['./send-quotes.component.scss'],
})
export class SendQuotesComponent implements OnInit, OnDestroy {
  quoteForm!: FormGroup;
  countries: CountryResponse = [];
  states: CountryState[] = [];
  totalQuoteAmount = 0;
  today = new Date().toISOString().slice(0, 10);
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private readonly fb: FormBuilder,
    public page: PageService,
    public quotesService: QuotesService,
    public addressService: AddressService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SendQuotesComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCountries();
  }

  initializeForm() {
    this.quoteForm = this.fb.group({
      unitPrice: [null, Validators.required],
      quantity: [this.data.quantity, Validators.required],
      handlingCharges: [0],
      insuranceCharges: [0],
      shippingCharges: [0],
      shippingPinCode: [''],
      validityDate: ['', Validators.required],
      countryId: ['', Validators.required],
      comments: [''],
    });
    this.quoteForm.valueChanges.subscribe({
      next: (res) => {
        this.calculateTotalQuoteAmount(res);
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
    this.quoteForm?.get('countryId')?.valueChanges.subscribe({
      next: (value: any) => {
        this.getStates(value);
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getStates(id: any) {
    if (!id) {
      this.states = [];
      return;
    }
    this.addressService
      .getStatesByCountryId(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.states = response;
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  get f() {
    return this.quoteForm.controls;
  }

  submit() {
     this.page.showLoader();
    this.quoteForm.value.requirementId = this.data.requirementId;
    this.quoteForm.value.validityDate = new Date(
      this.quoteForm.value.validityDate
    ).toISOString();
    this.quotesService
      .createQuote(this.quoteForm.value)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.quoteForm.reset();
          this.dismissModal('save');
          this.page.showSuccessToast('Quote Send successfully.');
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.showErrorToast(err?.error?.message);
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
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
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  calculateTotalQuoteAmount(data: any) {
    this.totalQuoteAmount =
      data.unitPrice * this.data.quantity +
      (data.handlingCharges + data.shippingCharges + data.insuranceCharges);
  }
  dismissModal(message: string) {
    this.dialogRef.close(message);
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
/*   dismissModal = (message: string) => this.activeModal.dismiss(message); */
}
