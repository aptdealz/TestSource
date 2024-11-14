import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { PageService } from 'src/app/services/page.service';
import { CountryResponse } from 'src/app/models/country.model';
import { SellerService } from 'src/app/services/seller.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { AddressService } from 'src/app/services/address.service';
import { CountryState } from 'src/app/models/state.model';
import { FileUploadRequest } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-personal-seller',
  templateUrl: './personal-seller.component.html',
  styleUrls: ['./personal-seller.component.scss'],
})
export class PersonalSellerComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  isPinCodeChanged = false;
  selectedStateFromPincode = '';
  countries: CountryResponse = [];
  states: CountryState[] = [];
  billingAddresses!: FormArray;
  categories: Category[] = [];
  subCategories: any[] = [];
  filename: string = '';
  filenameDoc: any = [];
  previewProfileImage: any;
  bannerImage: any;
  categoryTree: any = [];
  maximumNoOfCategories = 1;
  url: string = 'https://aptdealzapidev.azurewebsites.net/';
  documents = Array<string>();
  documentsFullPath = Array<string>();
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private page: PageService,
    public uploadService: UploadService,
    private fb: FormBuilder,
    public sellerService: SellerService,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    public addressService: AddressService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getCategories();
    this.getCountries();
    this.getSellerProfile();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  initializeForm() {
    this.formGroup = this.fb.group({
      sellerNo: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      alternativePhoneNumber: [''],
      profilePhoto: [''],
      about: [''],
      documents: [''],
      billingAddresses: this.fb.array([]),
      companyProfile: this.fb.group({
        bannerImage: [''],
        description: [''],
        categories: this.fb.array([]),
        experience: ['', Validators.required],
        areaOfSupply: ['', Validators.required],
      }),
      bankInformation: this.fb.group({
        gstin: [
          '',
          [
            Validators.pattern(
              '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
            ),
          ],
        ],
        pan: [''],
        bankAccountNumber: [''],
        branch: [''],
        ifsc: [''],
      }),
    });
    this.addBillingAddressesOfObjects();
  }

  addCategory() {
    this.formcategories.push(this.createCategoryObject());
  }

  get formcategories() {
    return this.formGroup.get('companyProfile')?.get('categories') as FormArray;
  }

  onCountryChange(event: any) {
    if (event.target.value == 0) {
      this.billingAddressesArray.controls[0].get('state')?.patchValue('');
    }
    this.getStates(event.target.value);
  }

  get billingAddressesArray() {
    return this.formGroup.get('billingAddresses') as FormArray;
  }

  get companyProfile() {
    return this.formGroup.get('companyProfile') as FormGroup;
  }

  get bankInformation() {
    return this.formGroup.get('bankInformation') as FormGroup;
  }

  patchBillingAddressesArray(form_data: any) {
    if (form_data?.billingAddresses?.length > 0) {
      form_data?.billingAddresses.forEach((element: any) => {
        this.billingAddressesArray.push(this.createBillingAddressesObject());
      });
    }
  }

  addBillingAddressesOfObjects() {
    this.billingAddressesArray.push(this.createBillingAddressesObject());
  }

  createCategoryObject() {
    return this.fb.group({
      category: ['', Validators.required],
      businessCategoryId: [0],
      parentId: [0],
      subCategories: [[], Validators.required],
    });
  }

  createBillingAddressesObject() {
    return this.fb.group({
      buildingNumber: [''],
      street: [''],
      city: [''],
      state: [''],
      pinCode: [''],
      countryId: [0],
      landmark: [''],
      district: [''],
    });
  }

  getSellerProfile() {
     this.page.showLoader();
    const categoryTreeApi = this.subcategoryService.getSubCategoryTree();
    const resApi = this.sellerService.getSellerProfile();

    forkJoin([categoryTreeApi, resApi]).subscribe({
      next: ([categoryTree, res]) => {
        this.categoryTree = categoryTree;
        this.maximumNoOfCategories = res.data.maximumNoOfCategories;
        res.data.companyProfile.categories.forEach((category: any) => {
          let allSubCats = this.categoryTree?.find((item: any) => {
            return item.name == category.category;
          })?.subCategories;
          category.subCategories = allSubCats?.filter((obj: any) =>
            category.subCategories.includes(obj.name)
          );

        });

        res.data.companyProfile.categories.forEach((element: any) => {
          this.formcategories.push(this.createCategoryObject());
        });

        this.formGroup.patchValue(res.data);
        this.documentsFullPath = res.data.documents;
        this.getStates(this.billingAddressesArray.value[0].countryId);
        this.previewProfileImage = res.data.profilePhoto;
        this.bannerImage = res.data.companyProfile.bannerImage;
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.showErrorToast(err);
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  getPayloadBody() {
    let billingAddresses = this.billingAddressesArray.value[0];
    let categories = this.formGroup.value.companyProfile.categories.map(
      (category: any) => {
        let cat = Object.assign({}, category);
        cat.subCategories = category.subCategories.map((subCat: any) => {
          return subCat.name;
        });
        return cat;
      }
    );
    let billing = {
      buildingNumber: billingAddresses.buildingNumber,
      street: billingAddresses.street,
      state: billingAddresses.state,
      city: billingAddresses.city,
      countryId: parseInt(billingAddresses.countryId),
      pinCode: billingAddresses.pinCode,
      landmark: billingAddresses.landmark,
    };
    let data = {
      fullName: this.formGroup.value.fullName,
      email: this.formGroup.value.email,
      phoneNumber: this.formGroup.value.phoneNumber,
      profilePhoto: this.previewProfileImage,
      alternativePhoneNumber: this.formGroup.value.alternativePhoneNumber,
      about: this.formGroup.value.about,
      buildingNumber: billingAddresses.buildingNumber,
      street: billingAddresses.street,
      bannerImage: this.bannerImage,
      state: billingAddresses.state,
      city: billingAddresses.city,
      countryId: parseInt(billingAddresses.countryId),
      pinCode: billingAddresses.pinCode,
      landmark: billingAddresses.landmark,
      billingAddresses: [billing],
      description: this.formGroup.value.companyProfile.description,
      experience: this.formGroup.value.companyProfile.experience,
      areaOfSupply: this.formGroup.value.companyProfile.areaOfSupply,
      gstin: this.formGroup.value.bankInformation.gstin,
      pan: this.formGroup.value.bankInformation.pan,
      bankAccountNumber: this.formGroup.value.bankInformation.bankAccountNumber,
      branch: this.formGroup.value.bankInformation.branch,
      ifsc: this.formGroup.value.bankInformation.ifsc,
      documents: this.documentsFullPath,
      categories: categories,
    };
    return data;
  }
  update() {
    let data: any = this.getPayloadBody();
     this.page.showLoader();
    this.sellerService
      .updateSellerProfile(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.page.showSuccessToast(res.message);
          } else if (res.errors) {
            this.page.showErrorToast(res.errors.join('<br>'));
          } else {
            this.page.showErrorToast(res.message);
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          if(err.error) {
            this.page.showErrorToast(
              err.error.message ? err.error.message : err.message
            );
          } else {
            this.page.showErrorToast(
              err.message ? err.message : err.error.message
           );
          }
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  get f() {
    return this.formGroup.controls;
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
          if (this.isPinCodeChanged) {
            this.f.state.setValue(this.selectedStateFromPincode);
            this.isPinCodeChanged = false;
          }
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  getCategories() {
     this.page.showLoader();

    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.showErrorToast(err ?? 'Server Error occured');
          this.page.handleError(err);
        },
      });
  }

  onFileChangeBanner(event: any) {
    if (event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        this.filename = file.name;
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded1.bind(this);
        reader.readAsBinaryString(file);
      }
    }
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

  _handleReaderLoaded1(e: any) {
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
            this.bannerImage = response.data.fileUri;
          } else {
            this.page.showErrorToast(response.message);
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.showErrorToast('Server Error occured');
          this.page.handleError(err);
        },
      });
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
          this.page.handleError(err);
        },
      });
  }
  onSelectAll() {
    this.formGroup?.get('subCategories')?.patchValue([
      ...this.subCategories.map((sub) => {
        return { name: sub.name };
      }),
    ]);
  }
  clearsubcatother() {
    this.formGroup.patchValue({ subCategoriesother: null });
  }
  async onFileChangeDoc(event: any) {
    if (event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        let binary = await this.fileToBinaryString(file);
        this._handleReaderLoadedDoc(binary, file.name);
      }
    }
  }
  fileToBinaryString(file: File): Promise<string> {
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
  _handleReaderLoadedDoc(binary: any, filename: any) {
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
            this.documents.push(data.data.relativePath);
            this.documentsFullPath.push(data.data.fileUri);
          } else {
            this.page.showErrorToast(data.message);
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  removeDoc(i: any) {
    this.documentsFullPath.splice(i, 1);
  }

  getSubCategoryOptions(i: any) {
    if (
      this.categoryTree?.find((item: any) => {
        return item.name == this.formcategories.value[i].category;
      })?.subCategories
    ) {
      return this.categoryTree.find((item: any) => {
        return item.name == this.formcategories.value[i].category;
      })?.subCategories;
    } else {
      return [];
    }
  }

  onCategoryChange(index: any) {
    this.formcategories.controls[index].patchValue({ subCategories: [] });
  }

  deleteCategory(index: any) {
    if (this.formcategories.controls.length > 1) {
      this.formcategories.removeAt(index);
    }
  }

  getAvailableCategories(index: any) {
    let selectedCategories: any = [];
    this.formcategories.value.forEach((formItem: any) => {
      selectedCategories.push(formItem.category);
    });
    return this.categories.filter((category: any) => {
      return (
        !selectedCategories.includes(category.name) ||
        this.formcategories.value[index].category == category.name
      );
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

  get subCategoriesControl(){
    return this.formGroup?.get('companyProfile')?.get('categories')
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
}
