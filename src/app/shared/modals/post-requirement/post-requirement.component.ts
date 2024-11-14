import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { PageService } from 'src/app/services/page.service';
import { units } from '../../../helpers/generic.helper.';
import { CountryResponse } from 'src/app/models/country.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { RequirementRequest } from 'src/app/models/requirement.model';
import { RequirementService } from 'src/app/services/requirement.service';
import { AddressService } from 'src/app/services/address.service';
import { CountryState } from 'src/app/models/state.model';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { FileUploadRequest } from 'src/app/models/file-upload.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-post-requirement',
  templateUrl: './post-requirement.component.html',
  styleUrls: ['./post-requirement.component.scss'],
})
export class PostRequirementComponent implements OnInit, OnDestroy {
  requirementForm!: FormGroup;
  categories: Category[] = [];
  subCategories: Subcategory[] = [];
  subCategoriesNameObject: any[] = [];
  productImage: any;
  filename: string = '';
  previewProductImage: string = '';
  isReseller: boolean = false;
  isPickup: boolean = false;
  shipping_address_same_as_billing = false;
  profileData!: BuyerResponse;
  units = units;
  countries: CountryResponse = [];
  statesB: CountryState[] = [];
  statesC: CountryState[] = [];
  today = new Date().toISOString().slice(0, 10);
  private ngUnsubscribe$ = new Subject<void>();
  isBillingPinCodeChanged = false;
  selectedBillingStateFromPincode = '';

  isShippingPinCodeChanged = false;
  selectedShippingStateFromPincode = '';
  constructor(
    private readonly fb: FormBuilder,
    public uploadService: UploadService,
    private page: PageService,
    public buyerService: BuyerService,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    public requirementService: RequirementService,
    public addressService: AddressService,
    public dialogRef: MatDialogRef<PostRequirementComponent>
  ) {}

  ngOnInit() {
    this.requirementForm = this.fb.group({
      title: ['', Validators.required],
      totalPriceEstimation: ['', Validators.required],
      category: ['', Validators.required],
      subCategories: ['', Validators.required],
      productDescription: ['', Validators.required],
      quantity: [1, Validators.required],
      unit: ['', Validators.required],
      productImage: [''],
      gstin: [''],
      expectedDeliveryDateStr: ['', Validators.required],
      preferredSourceOfSupply: ['', Validators.required],
      isReseller: [false, Validators.required],
      preferInIndiaProducts: [false, Validators.required],
      pickupProductDirectly: [false, Validators.required],
      needInsuranceCoverage: [false, Validators.required],
      agreeGSTc: [false, Validators.required],
      deliveryLocationPinCode: ['', Validators.pattern(/^(\d{6})$/)],
      billingAddressBuilding: ['', Validators.required],
      billingAddressCountry: ['', Validators.required],
      billingAddressCity: ['', Validators.required],
      billingAddressName: ['', Validators.required],
      billingAddressState: [null, Validators.required],
      billingAddressStreet: ['', Validators.required],
      billingAddressPinCode: ['', [Validators.required, Validators.pattern(/^(\d{6})$/)]],
      billingAddressLandmark: ['', Validators.required],
      shippingAddressStreet: ['', Validators.required],
      shippingAddressCountry: ['', Validators.required],
      shippingAddressState: [null, Validators.required],
      shippingAddressPinCode: ['', [Validators.required, Validators.pattern(/^(\d{6})$/)]],
      shippingAddressName: ['', Validators.required],
      shippingAddressCity: ['', Validators.required],
      shippingAddressBuilding: ['', Validators.required],
      shippingAddressLandmark: ['', Validators.required],
    });
    this.getCategories();
    this.getCountries();
    this.requirementForm?.get('billingAddressCountry')?.valueChanges.subscribe({
      next: (value: any) => {
        this.getStatesByBilling(value);
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
    this.requirementForm
      ?.get('shippingAddressCountry')
      ?.valueChanges.subscribe({
        next: (value: any) => {
          this.getStatesByShipping(value);
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });

    this.buyerService
      .getBuyerProfile()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.profileData = res.data;
          this.requirementForm.patchValue({
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
  onSelectAll() {
    this.requirementForm?.get('subCategories')?.patchValue([
      ...this.subCategories.map((sub) => {
        return { name: sub.name, subCategoryId: sub.subCategoryId };
      }),
    ]);
  }
  clearsubcatother() {
    this.requirementForm.patchValue({ subCategoriesother: null });
  }
  checkReseller(event: any) {
    if (event.target.checked) {
      if (this.profileData.gstin) {
        this.requirementForm.patchValue({
          gstin: this.profileData.gstin,
        });
      }
    }
    this.isReseller = !this.isReseller;
  }
  checkPickup(event: any) {
    this.isPickup = !this.isPickup;
  }
  get f() {
    return this.requirementForm.controls;
  }

  get quantity() {
    return this.requirementForm.get('quantity') as FormControl;
  }

  onQuantityDecrement() {
    let value = this.quantity.value - 1;
    if (value > 0) {
      this.quantity.setValue(value);
    }
  }

  onQuantityIncrement() {
    let value = this.quantity.value + 1;
    this.quantity.setValue(value);
  }

  getCategories() {
     this.page.showLoader();
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.categories = response;
          this.page.hideLoader();
        },
        error: (err: any) => {
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
          this.page.hideLoader();
          this.statesB = response;
          if (this.isBillingPinCodeChanged) {
           let value:any = this.statesB.find(ele => ele.name == this.selectedBillingStateFromPincode)
            this.f.billingAddressState.setValue(value.stateId);
            this.isShippingPinCodeChanged = false;
          }else{
           let value:any = this.statesB.filter(ele => ele.name == this.profileData?.state)
          if(value.length > 0)
            this.requirementForm.patchValue({
              billingAddressState: value[0].stateId,
            })
          }

        },
        error: (err: any) => {
          this.page.hideLoader();
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
          this.page.hideLoader();
          if (this.isShippingPinCodeChanged) {
            let value:any = this.statesC.find(ele => ele.name == this.selectedShippingStateFromPincode)
            this.f.shippingAddressState.setValue(value.stateId);
            this.isShippingPinCodeChanged = false;
          }
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  getSubCategoriesByName(name: any) {
    let catID = this.categories.find(
      (element) => element.name == name
    )?.categoryId;

     this.page.showLoader();
    this.subCategories = new Array();
    this.requirementForm.patchValue({ categoryother: null });
    this.requirementForm.patchValue({ subCategories: null });

    this.subcategoryService
      .getSubCategoriesById(catID!)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.subCategories = response;
          this.subCategoriesNameObject = this.subCategories.map((ele) => {
            return { name: ele.name, subCategoryId: ele.subCategoryId };
          });
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.showErrorToast(err ?? 'Server Error occured');
          this.page.handleError(err);
        },
      });
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
            this.productImage = response.data.relativePath;
            this.previewProductImage = response.data.fileUri;
            this.requirementForm.patchValue({
              productImage: this.previewProductImage,
            });
            // this.page.showSuccessToast(response.message);
          } else {
            this.page.showErrorToast(response.message);
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  sameBilling(){
    if (this.shipping_address_same_as_billing) {
      this.requirementForm.patchValue({
        shippingAddressBuilding:
          this.requirementForm.value.billingAddressBuilding,
        shippingAddressCity: this.requirementForm.value.billingAddressCity,
        shippingAddressName: this.requirementForm.value.billingAddressName,
        shippingAddressState: this.requirementForm.value.billingAddressState,
        shippingAddressCountry:
          this.requirementForm.value.billingAddressCountry,
        shippingAddressStreet: this.requirementForm.value.billingAddressStreet,
        shippingAddressPinCode:
          this.requirementForm.value.billingAddressPinCode,
        shippingAddressLandmark:
          this.requirementForm.value.billingAddressLandmark,
      });
    }
  }
  submit() {

     if (this.requirementForm.valid) {
      let data = this.requirementForm.value;
     data.subCategories = data.subCategories.map(
        (element: any) => element.name
      );
        this.page.showLoader();
      let requirementData: RequirementRequest = this.requirementForm.value;
      this.requirementService
        .createRequirement(requirementData)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.page.showSuccessToast('Requirement Created successfully.');
            this.requirementForm.reset();
            this.dismissModal('close');
            this.page.hideLoader();
          },
          error: (err: any) => {
            this.page.showErrorToast(err?.error?.message);
            this.page.hideLoader();
          },
        });
    } else {
      this.requirementForm.markAllAsTouched();
      this.page.showErrorToast('Please enter required fields.');
    }
  }
  dismissModal(message: string) {
    this.dialogRef.close(message);
  }
  get subCategoriesControl(){
    return this.requirementForm?.get('subCategories')
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
