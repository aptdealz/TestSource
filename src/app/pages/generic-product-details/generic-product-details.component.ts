import { Component, OnDestroy, OnInit, afterNextRender, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { PageService } from 'src/app/services/page.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { CongratsPopupComponent } from 'src/app/shared/modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { SendEnquiryComponent } from 'src/app/shared/modals/send-enquiry/send-enquiry.component';
import { SignupComponent } from 'src/app/shared/modals/signup/signup.component';
import { Page } from 'src/app/enums/page.enum';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RoleService } from 'src/app/services/role.service';
import { BannerService } from 'src/app/services/banner.service';
import { BannerResponse } from 'src/app/models/banner.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { GenericProduct } from 'src/app/models/generic-product.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-generic-product-details',
  templateUrl: './generic-product-details.component.html',
  styleUrls: ['./generic-product-details.component.scss'],
})
export class GenericProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private bannerService = inject(BannerService);
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/product', back: '' },
    { title: '', path: '' },
  ];

  id: any;
  list!: GenericProduct;
  listOfOtherVendors: Product[] = [];
  relatedProducts: GenericProduct[] = [];
  loading: boolean = true;
  pageTitle: string = 'Product Details';
  banners: BannerResponse[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  ngOnInit(): void {
    this.bannerService
      .getBannerImages(Page.ProductDetailsPage)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.banners = res.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.id = params['id'];
        this.productService
          .getGenericProductsByUrlTitle({ UrlTitle: this.id })
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.list = res.data;

              this.titleService.setTitle(
                (this.list.seoTitle ?? this.list?.title) + ''
              );
              this.meta.updateTag({
                name: 'description',
                content:
                  this.list.metaDescription ?? this.list.shortDescription,
              });

              this.list.description = this.replaceNewline(res.data.description);
              this.list.specifications = this.replaceNewline(
                res.data.specifications
              );
              this.breadcrumbs[2].title = this.list.title;
              this.getProductByOrther();
              this.getRelatedProducts();
            },
            error: (err: any) => {
              this.page.handleError(err);
            },
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
  replaceNewline(string: any) {
    return string.replace(/\n/g, '<br>');
  }
  getProductByOrther() {
    this.productService
      .getSellerProductGetByOthers({
        UserId: null,
        SubCategoryId: this.list.subCategoryId,
        CategoryId: this.list.categoryId,
      })
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
  getRelatedProducts() {
    this.productService
      .getGenericProducts({
        SubCategoryId: this.list.subCategoryId,
        CategoryId: this.list.categoryId,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.relatedProducts = res.data;
          this.relatedProducts = this.relatedProducts.filter((item: any) => {
            return item.sellerProductId != this.id;
          });
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });
  }
  sendEnquiry() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'enquiry-dialog';
    dialogConfig.data = {item: this.list};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SendEnquiryComponent, {
      ...dialogConfig
    });
  }
  addToCart(item: any) {
    if (!this.authService.isLoggedIn) {
      this.loginModal();
    } else if (this.roleService.isSeller()) {
      let message =
        'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'congrats-dialog';
      dialogConfig.data = {text: message,isBuyer:true, title: title};
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(CongratsPopupComponent, {
        ...dialogConfig
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_buyer') {
          this.authService.logout();
          /*  const closeModalRef = this.modalService.open(LoginComponent, {
             size: 'lg',
             centered: true,
           }); */
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
        }
      });
    } else {
      this.cartService
        .addItemToCart(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.cartService.syncCart();
          },
          error: (err: any) => {
            this.page.showErrorToast('Some Error Occoured');
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
            ...dialogConfig
          });
          dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == 1) {
          //this.page.showSuccessToast('User Logged In', '');
        }
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
  }
  isAlreadyInCart(item: any) {
    return this.cartService.isItemInCart(item.genericProductId);
  }
  addToCartAndOpenCartModal(item: any) {
    if (this.cartService.cart) {
      this.cartService.cart.forEach((ele: any) => {
        this.remove(ele.cartId);
        this.cartService.resetCart();
      });
    }
    if (!this.authService.isLoggedIn) {
      this.loginModal();
    } else if (this.roleService.isSeller()) {
      let message =
        'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'congrats-dialog';
      dialogConfig.data = {text: message,isBuyer:true, title: title};
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(CongratsPopupComponent, {
        ...dialogConfig
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_buyer') {
          this.authService.logout();
          /*  const closeModalRef = this.modalService.open(LoginComponent, {
             size: 'lg',
             centered: true,
           }); */
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
        }
      });
    } else {
      this.page.showLoader();

      this.cartService
        .addItemToCart(item)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.cartService.syncCart();
            setTimeout(() => {
              this.page.hideLoader();
              this.openCart(item);
            }, 2000);
          },
          error: (err: any) => {
            this.page.showErrorToast('Some Error Occoured');
            this.page.handleError(err);
          },
        });
    }
  }
  remove(id: any) {
    this.cartService
      .deleteItemFromMyCart(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.cartService.syncCart();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  openCart(item: any) {
    if (!this.authService.isLoggedIn) {
      this.loginModal();
    } else {
      /* const modalRef = this.modalService.open(CartModalComponent, {
        size: 'xl',
        centered: true,
      });
      modalRef.componentInstance.item = item; */


     const dialogConfig = new MatDialogConfig();
     dialogConfig.panelClass = 'cart-dialog';
     dialogConfig.data = {item: item};
     dialogConfig.disableClose =true;
     const dialogRef = this.dialog.open(CartModalComponent, {
       ...dialogConfig
     });
    }
  }

}
