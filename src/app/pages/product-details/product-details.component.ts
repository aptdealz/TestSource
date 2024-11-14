import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SendEnquiryComponent } from 'src/app/shared/modals/send-enquiry/send-enquiry.component';
import { Page } from 'src/app/enums/page.enum';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BannerService } from 'src/app/services/banner.service';
import { BannerResponse } from 'src/app/models/banner.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/promoted-products' },
    { title: '', path: '' },
  ];

  id: any;
  list!: Product;
  listOfOtherVendors: Product[] = [];
  relatedProducts: Product[] = [];
  loading: boolean = true;
  pageTitle: string = 'Product Details';
  banners: BannerResponse[] = [];
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public metaService: Meta,
    private page: PageService,
    public bannerService: BannerService,
    public productService: ProductService,
    public dialog: MatDialog
  ) {}

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
          .getAllSellerProductsById(this.id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.list = res.data;
              this.titleService.setTitle(
                (this.list.seoTitle ?? this.list?.title) + ''
              );
              this.metaService.updateTag({
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
        UserId: this.list.userId,
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
      .getSellerProductGetAll({
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

}
