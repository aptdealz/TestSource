import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import SwiperCore, {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
} from 'swiper';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { BannerService } from 'src/app/services/banner.service';
import { PageService } from 'src/app/services/page.service';
import { PartnerService } from 'src/app/services/partner.service';
import { ProductService } from 'src/app/services/product.service';
import { TestimonialService } from 'src/app/services/testimonial.service';
import { CongratsPopupComponent } from 'src/app/shared/modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { PostRequirementComponent } from 'src/app/shared/modals/post-requirement/post-requirement.component';
import { SignupComponent } from 'src/app/shared/modals/signup/signup.component';
import { Page } from 'src/app/enums/page.enum';
import { units } from 'src/app/helpers/generic.helper.';
import { BannerResponse } from 'src/app/models/banner.model';
import { Testimonial } from 'src/app/models/testimonial.model';
import { LeadService } from 'src/app/services/lead.service';
import { Product } from 'src/app/models/product.model';
import { PartnerDetail, Seller } from 'src/app/models/seller.model';
import { SellerProductTitle } from 'src/app/models/seller-product-title.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { SellerService } from 'src/app/services/seller.service';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { ResponseModel } from 'src/app/models/generic/response.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// install Swiper modules
SwiperCore.use([Navigation, Autoplay, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private roleService = inject(RoleService);

  private bannerService = inject(BannerService);
  private page = inject(PageService);
  private partnerService = inject(PartnerService);
  private productService = inject(ProductService);
  private testimonialService = inject(TestimonialService);
  private leadService = inject(LeadService);
  private buyerService = inject(BuyerService);
  private sellerService = inject(SellerService);
  private dialog = inject(MatDialog);
  isLoggedIn = this.authService.isLoggedIn;

  private ngUnsubscribe$ = new Subject<void>();
  pageTitle: string =
    'B2B E-commerce Website for Buyer in India';

  isInputFocused = false;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  listVendor: Seller[] = [];
  loading: boolean = true;
  listOfOtherVendors: Product[] = [];
  topBanners: BannerResponse[] = [];
  banners: BannerResponse[] = [];
  testimonials: Testimonial[] = [];
  suggestions: SellerProductTitle[] = [];
  topBannerscheck: boolean = true;
  homeForm!: FormGroup;
  units = units;
  ngOnInit(): void {
    this.page.showLoader();
    setTimeout(() => {
      this.page.hideLoader();
    }, 2000);
    this.page.setTitleAndDescription(
      this.pageTitle,
      'Quotesouk is India´s emerging Online B2B Marketplace for Buyers in India. ✔Grow your business by connecting with wholesale Manufacturers & suppliers through our B2B Business Directory.'
    );
    this.homeForm = this.fb.group({
      name: [''],
      phoneNumber: [''],
      productName: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      shippingAddress: ['', [Validators.required]],
      unit: [null, [Validators.required]],
    });
    this.bannerService
      .getBannerImages(Page.HomePageTopBanner)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.topBanners = res.data;
          this.topBannerscheck = false;
        },
        error: (err: any) => {
          this.topBannerscheck = false;
          this.page.handleError(err);
        },
      });
    this.bannerService
      .getBannerImages(Page.HomePage)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.banners = res.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.testimonialService
      .getTestimonials()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.testimonials = res.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.partnerService
      .getAllTopSellers()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.listVendor = res.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });

    this.productService
      .getTopSellerProducts()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.listOfOtherVendors = res.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  allowOnlyNumbers(event: any) {
    if(event.key == '+') return;
    if(event.target.value.length >= 12) {
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
  submit() {
    if (this.authService.isLoggedIn) {
      this.page.showLoader();
      let call: any = this.roleService.isBuyer()
        ? this.buyerService.getBuyerProfile()
        : this.sellerService.getSellerProfile();
      call.subscribe({
        next: (res: ResponseModel<BuyerResponse | PartnerDetail>) => {
          // this.buyerlist = res.data;
          this.homeForm.patchValue({
            name: res.data.fullName,
            phoneNumber: res.data.phoneNumber,
          });
          this.leadService
            .createLeadFromUser(this.homeForm.value)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                this.homeForm.reset();
                this.page.showSuccessToast(
                  'Your Enquiry was submitted successfully'
                );
                this.page.hideLoader();
              },
              error: (err: any) => {
                this.page.showErrorToast('Unable to create Enquiry');
                this.page.hideLoader();
                this.page.handleError(err);
              },
            });
        },
        error: (err: any) => {
          this.page.showErrorToast('Unable to create Enquiry');
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
    } else {
      if (!this.homeForm.value.name || !this.homeForm.value.phoneNumber) {
        this.page.showErrorToast('Name and Phone Number are required');
        return;
      }
      this.page.showLoader();
      this.leadService
        .createLeadFromUser(this.homeForm.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.homeForm.reset();
            if (this.authService.isLoggedIn) {
              this.page.showSuccessToast(
                'Your Enquiry was Submitted Successfully'
              );
            } else {
              this.loginModal();
            }
            this.page.hideLoader();
          },
          error: (err: any) => {
            this.page.showErrorToast('Unable to create Enquiry');
            this.page.hideLoader();
            this.page.handleError(err);
          },
        });
    }
  }

  loginModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig,
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == 1) {
        //  this.page.showSuccessToast('User Logged In', '');
        }
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  open() {
    if (this.authService.isLoggedIn) {
      if (this.roleService.isBuyer()) {
        /*  const modalRef = this.modalService.open(PostRequirementComponent, {
          windowClass: 'myCustomModalClass',
          centered: true,
        }); */
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'requirement-dialog';
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(PostRequirementComponent, {
          ...dialogConfig,
        });
      } else if (this.roleService.isSeller()) {
        let message =
          'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
        let title = 'Access Denied';
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = { text: message, isBuyer: true, title: title };
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig,
        });

        dialogRef.afterClosed().subscribe((res) => {
          if (res == 'login_buyer') {
            this.authService.logout();
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'login-dialog';

            dialogConfig.disableClose =true;
            const dialogRef = this.dialog.open(LoginComponent, {
              ...dialogConfig,
            });
          } else if (res == 'cross_click') {
            this.authService.logout();
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'signup-dialog';
            dialogConfig.disableClose =true;
            const dialogRef = this.dialog.open(SignupComponent, {
              ...dialogConfig,
            });
          }
        });
      }
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig,
      });
      /*  dialogRef.afterClosed().subscribe((res) => {
        this.open();
      }); */
    }
    //  modalRef.componentInstance.name = 'World';
  }

  onSearchByRequirement() {
    console.log('requirement-list')
    this.router.navigateByUrl('/requirement-list');
   /*  if (this.authService.isLoggedIn) {
      this.router.navigateByUrl('/requirement-list');
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig,
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.router.navigateByUrl('/requirement-list');
      });
    } */
  }

  showSuggestions(event: any) {
    if (event.target.value) {
      const Title = event.target.value.toString();
      this.productService
        .getSellerProductsSuggestions({ Title })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            if (res.data) {
              this.suggestions = res.data.map((item: any) => {
                return item.title;
              });
            } else {
              this.suggestions = [];
            }
          },
          error: (err: any) => {
            this.suggestions = [];
            this.page.handleError(err);
          },
        });
    }
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused = false;
    }, 250);
  }
  get getSuggestions() {
    return (
      this.suggestions.length > 0 &&
      this.homeForm.get('productName')?.value &&
      this.isInputFocused
    );
  }
}
