import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';
import { PageService } from 'src/app/services/page.service';
import { SellerRegistrationSuccessComponent } from 'src/app/shared/modals/seller-registration-success/seller-registration-success.component';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { CountryResponse } from 'src/app/models/country.model';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { Subcategory } from 'src/app/models/subcategory.model';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { CountryState } from 'src/app/models/state.model';
import { FileUploadRequest } from 'src/app/models/file-upload.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss'],
})
export class VendorRegistrationComponent
  implements AfterContentInit, OnDestroy
{
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Become A Seller', path: '' },
  ];
  sellerDetailsForm!: FormGroup;
  sellerSignupData: any;
  countries: CountryResponse = [];
  states: CountryState[] = [];
  categories: Category[] = [];
  subCategories: Subcategory[] = [];
  subCategoriesNameObject: any[] = [];
  dropdownSettings = {};
  documents = Array<string>();
  documentsFullPath = Array();
  filename: string = '';
  pageTitle: string = 'Best B2B E-Commerce Website in India | Top B2B Portal in India';
  private ngUnsubscribe$ = new Subject<void>();
  subcategoryFilteredOption:any;
  hidePassword = true;
  isPinCodeChanged = false;
  selectedStateFromPincode = '';

  constructor(
     private readonly fb: FormBuilder,
    public page: PageService,
    public uploadService: UploadService,
    public router: Router,
    private titleService: Title,
    private meta: Meta,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    public staticPagesService: StaticPagesService,
    public addressService: AddressService,
    public authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngAfterContentInit(): void {
    this.meta.updateTag({
      name: 'description',
      content:
        'Ready to start selling wholesale but don\'t know how to become a wholesaler? No worries! Create a seller account on Quotesouk, the top B2B Portal in India.',
    });

    this.titleService.setTitle(this.pageTitle);
    this.sellerDetailsForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ],
        ],
        alternativePhoneNumber: [
          '',
          [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
            ),
          ],
        ],
        building: [''],
        street: [''],
        city: [''],
        state: [''],
        landmark: [''],
        district: [''],
        pinCode: ['', [Validators.maxLength(6)]],
        countryId: [''],
        // about: [''],
        description: [''],
        category: ['', [Validators.required]],
        subCategories: ['', [Validators.required]],
        experience: ['', Validators.required],
        areaOfSupply: ['', Validators.required],
        gstin: [
          '',
          [
            Validators.pattern(
              '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
            ),
          ],
        ],
        pan: ['', [Validators.pattern('([A-Z]){5}([0-9]){4}([A-Z]){1}$')]],
        bankAccountNumber: [''],
        branch: [''],
        ifsc: [''],
        // commissionRate: ['', Validators.required],
        file: [''],
        subCategoriesother: [''],
        categoryother: [''],
        documents: [''],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: [
          this.MustMatch('password', 'confirmPassword'),
          this.InvalidPassword('password'),
          this.GstinPanMustMatch('gstin', 'pan'),
        ],
      }
    );
    this.getCountries();
    this.getCategories();
  }
  pincodeChange() {
    if (this.f.pinCode.valid && (this.f.pinCode.value.toString().length === 6)) {
      this.addressService.getDataFromPinCode(this.f.pinCode.value).subscribe({
        next: (res) => {
          if (res.succeeded) {
            let data: any = res.data;
            let country:any = this.countries.find(ele => ele.name == data.country);
            this.f.countryId.setValue(country.countryId);
            this.getStates(country.countryId);
            this.f.city.setValue(res.data.division);
            this.f.district.setValue(res.data.district);
            this.selectedStateFromPincode = res.data.state;
            this.isPinCodeChanged = true;
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  ngOnInit() {
  }
  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }
  onSelectAll() {
    this.sellerDetailsForm?.get('subCategories')?.patchValue([
      ...this.subCategories.map((sub) => {
        return { name: sub.name };
      }),
    ]);
  }
  filterSub(event:any){
  const filterValue = event.target.value.toLowerCase();
  this.subcategoryFilteredOption =this.subCategoriesNameObject.filter(option => option.name.toLowerCase().includes(filterValue));
 }
 isOptionVisible(item:any){
 return this.subcategoryFilteredOption.find((ele:any )=>
  ele.name == item.name
  )
 }
 setAllOptions(value:any){
  if(value){
    this.sellerDetailsForm?.get('subCategories')?.patchValue([
      ...this.subCategories.map((sub) => {
        return  sub.name ;
      }),
    ]);
  }
  else{
    this.sellerDetailsForm?.get('subCategories')?.patchValue([]);
  }
 }
  showSuccessModal() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'seller-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SellerRegistrationSuccessComponent, {
      ...dialogConfig
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

  getStates(countryId: string) {
    if (!countryId) {
      this.states = [];
      return;
    }
    this.addressService
      .getStatesByCountryId(+countryId)
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
          this.states = [];
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
  getSubCategoriesById(catID: any) {
     this.page.showLoader();
    this.subCategories = new Array();
    this.sellerDetailsForm.patchValue({ categoryother: null });
    this.sellerDetailsForm.patchValue({ subCategories: null });
    this.sellerDetailsForm.patchValue({ subCategoriesother: null });

    this.subcategoryService
      .getSubCategoriesById(catID)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
          this.subCategories = response;
          this.subCategoriesNameObject = this.subCategories.map((ele) => {
            return { name: ele.name };
          });
          this.subcategoryFilteredOption = this.subCategories.map((ele) => {
            return { name: ele.name };
          });
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  InvalidPassword(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const regex = new RegExp(
        '^(?=.*?[A-Za-z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]]).{6,}$'
        // '^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{6,}$'
      );
      const valid = regex.test(control.value);
      // set error on matchingControl if validation fails
      if (!valid) {
        control.setErrors({ invalidPassword: true });
      } else {
        control.setErrors(null);
      }
    };
  }
  GstinPanMustMatch(gstinControlName: string, panControlName: string) {
    return (formGroup: FormGroup) => {
      const gstinControl = formGroup.controls[gstinControlName];
      const panControl = formGroup.controls[panControlName];

      if (panControl.errors && !panControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      const gstinValue = gstinControl.value as string;
      const panValue = panControl.value as string;
      const panFromGSTIN = gstinValue?.substr(2, 10);
      if (panFromGSTIN?.toLowerCase() != panValue?.toLowerCase()) {
        panControl.setErrors({ mustMatchGST: true });
      } else {
        panControl.setErrors(null);
      }
    };
  }

  stateSelected() {
    if ((this.f.state.value ?? '').length > 0) {
      const state = this.states.find((u) =>
        u.name?.toLowerCase().startsWith(this.f.state.value.toLowerCase())
      );
      if (state != null) {
        this.f.state.setValue(state.name);
      }
    }
  }

  clearsubcatother() {
    this.sellerDetailsForm.patchValue({ subCategoriesother: null });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.documents = [];
      this.documentsFullPath = [];
      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];

        this.filename = file.name;

        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this, file);
        reader.readAsBinaryString(file);
      }
    }
  }

  _handleReaderLoaded(file:any,e: any) {
    const request: FileUploadRequest = {
      base64String: btoa(e.target.result),
      fileName: file.name,
      fileUploadCategory: 1,
    };
    this.uploadService
      .uploadFile(request)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => {
           this.page.showLoader();
          if (response.succeeded) {
            this.documents.push(response.data.relativePath);
            let data:any ={
              url : response.data.fileUri,
              fileName: file.name
            }
            this.documentsFullPath.push(data);
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

  saveSeller() {
    this.sellerDetailsForm?.updateValueAndValidity();
    this.sellerDetailsForm.markAllAsTouched();
    if (this.sellerDetailsForm.valid) {
     this.addSeller();
    } else {
      this.sellerDetailsForm.markAllAsTouched();
      this.page.showErrorToast('Please enter required fields.');
    }
  }
  addSeller() {
     this.page.showLoader();
    this.sellerSignupData = this.sellerDetailsForm.getRawValue();
    if (
      this.sellerDetailsForm?.get('category')?.value == '' ||
      this.sellerDetailsForm?.get('category')?.value == null
    ) {
      if (
        this.sellerDetailsForm?.get('categoryother')?.value != '' ||
        this.sellerDetailsForm?.get('categoryother')?.value != null
      ) {
        this.sellerSignupData.category =
          this.sellerDetailsForm?.get('categoryother')?.value;
      }
    } else {
      var category = this.categories.find(
        (itm) => itm.categoryId == this.sellerSignupData?.category
      );
      this.sellerSignupData.category = {
        category: category?.name,
        subCategories: [],
      };
    }
    if (
      this.sellerDetailsForm?.get('subCategories')?.value == '' ||
      this.sellerDetailsForm?.get('subCategories')?.value == null
    ) {
      if (
        this.sellerDetailsForm?.get('subCategoriesother')?.value != '' ||
        this.sellerDetailsForm?.get('subCategoriesother')?.value != null
      ) {
        this.sellerSignupData.subCategories = [
          this.sellerDetailsForm?.get('subCategoriesother')?.value,
        ];
      }
    } else {
      var jsonlist = JSON.stringify(this.sellerSignupData?.subCategories);
      var jsonpar = JSON.parse(jsonlist);
      var jsonlistnew = '';
      for (let i = 0; i < jsonpar.length; i++) {
        if (i == 0) jsonlistnew = '"' + jsonpar[i].name + '"';
        else jsonlistnew = jsonlistnew + ',' + '"' + jsonpar[i].name + '"';
      }
      this.sellerSignupData.category.subCategories = JSON.parse(
        '[' + jsonlistnew + ']'
      );
     }
    delete this.sellerSignupData.subCategories;
    this.sellerSignupData.documents = this.documents;
    this.authService
      .signupSeller(this.sellerSignupData)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (reponse: any) => {
          this.page.hideLoader();
          if (reponse.succeeded) {
            this.page.showSuccessToast(reponse.message);
            this.documentsFullPath = [];
            this.showSuccessModal();
            this.sellerDetailsForm.reset();
          } else {
            this.page.showErrorToast(
              reponse.message ? reponse.message : reponse.error.message
            );
          }
          this.page.hideLoader();
        },
        error: (err: any) => {
          console.log(err);
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
  get f() {
    return this.sellerDetailsForm.controls;
  }
  get subCategoriesControl(){
   return this.sellerDetailsForm?.get('subCategories')
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
