import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { CountryResponse } from 'src/app/models/country.model';
import { AddressService } from 'src/app/services/address.service';
import { BuyerService } from 'src/app/services/buyer.service';
import { UploadService } from 'src/app/services/upload.service';
import { CountryState } from 'src/app/models/state.model';
import { FileUploadRequest } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  countries: CountryResponse = [];
  states: CountryState[] = [];
  filename: string = '';
  previewProfileImage: any;
  url: string = 'https://aptdealzapidev.azurewebsites.net/';
  private ngUnsubscribe$ = new Subject<void>();
  isPinCodeChanged = false;
  selectedStateFromPincode = '';
  constructor(
    private page: PageService,
    public uploadService: UploadService,
    private fb: FormBuilder,
    public buyerService: BuyerService,
    public addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCountries();
    this.getBuyerProfile();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  initializeForm() {
    this.formGroup = this.fb.group({
      buyerNo: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      building: ['', Validators.required],
      street: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      countryId: [, Validators.required],
      pinCode: ['', Validators.required],
      landmark: [''],
      gstin: [
        '',
        [
          Validators.pattern(
            '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
          ),
        ],
      ],
    });
    this.formGroup?.get('countryId')?.valueChanges.subscribe({
      next: (value: any) => {
        this.getStates(value);
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }
  pincodeChange() {
    if (this.f.pinCode.valid && (this.f.pinCode.value.toString().length === 6)) {
      this.addressService.getDataFromPinCode(this.f.pinCode.value).subscribe({
        next: (res) => {
          if (res.succeeded) {
            let data: any = res.data;
            let country:any = this.countries.find(ele => ele.name == data.country);
            this.f.countryId.setValue(country.countryId, { emitEvent: true });
            this.f.city.setValue(res.data.division);
            this.f.district.setValue(res.data.district);
            this.selectedStateFromPincode = res.data.state;
            this.isPinCodeChanged = true;
            this.getStates(country.countryId);
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    }
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
          this.page.hideLoader();
          this.states = response;
          if (this.isPinCodeChanged) {
            this.f.state.setValue(this.selectedStateFromPincode);
            this.isPinCodeChanged = false;
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  getBuyerProfile() {
     this.page.showLoader();

    this.buyerService
      .getBuyerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.previewProfileImage = res.data.profilePhoto;
          this.formGroup.patchValue(res.data);
           this.page.hideLoader();
        },
        error: (err: any) => {
           this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  update() {
    this.formGroup.value.profilePhoto = this.previewProfileImage;

     this.page.showLoader();
    this.buyerService
      .updateBuyerProfile(this.formGroup.value)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.page.showSuccessToast('Profile Updated successfully.');
          this.page.myProfileUpdate.next('profile updated');
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

  get f() {
    return this.formGroup.controls;
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        this.filename = file.name;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }
  _handleReaderLoaded(e: any) {
    const request: FileUploadRequest = {
      base64String: btoa(e.target.result),
      fileName: this.filename,
      fileUploadCategory: 1,
    };
    this.uploadService
      .uploadFile(request)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
           this.page.showLoader();
          if (response.succeeded) {
            this.previewProfileImage = response.data.fileUri;
          } else {
            this.page.showErrorToast(response.message);
          }
           this.page.hideLoader();
        },
        error: (err: any) => {
           this.page.hideLoader();
          this.page.showErrorToast('Server Error occured');
        },
      });
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
   allowPhoneNumberOnlyNumbers(event: any) {
    if(event.key == '+') return;
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
}
