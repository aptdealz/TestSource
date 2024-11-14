import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { Page } from 'src/app/enums/page.enum';
import { environment } from 'src/environments/environment';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BannerService } from 'src/app/services/banner.service';
import { BannerResponse } from 'src/app/models/banner.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { Subcategory } from 'src/app/models/subcategory.model';
import { CategoryTree } from 'src/app/models/category.model';
import { PartnerService } from 'src/app/services/partner.service';
import { PartnerDetail } from 'src/app/models/seller.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss'],
})
export class PartnerDetailsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Our Partner', path: '' },
    { title: '', path: '' },
    { title: '', path: '' },
  ];
  sellerDetails!: PartnerDetail;
  list: Product[] = [];
  loading: boolean = true;
  pageTitle: string = 'Partner Details';
  categoryTree: CategoryTree[] = [];
  sellerId: any;
  banners: BannerResponse[] = [];
  filter: boolean = false;
  pageNumber: any;
  totalRecords: any;
  filterForm: any;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public page: PageService,
    public fb: FormBuilder,
    public router: Router,
    public subcategoryService: SubcategoryService,
    public bannerService: BannerService,
    public partnerService: PartnerService,
    public productService: ProductService
  ) {
    this.page.showLoader();
    this.filterForm = this.fb.group({
      pageSize: environment.pageSize,
      pageNumber: 1,
      totalRecords: 1,
      subCategoryId: '',
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.initializePageParams();
    this.initializeOptionalQueryParams();
    this.getSellerPageBannerImages();
    this.getSubCategoryTree();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  initializePageParams = () => {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.sellerId = params['id'];
        this.getSellerDetails();
        this.getSellerProduct();
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  };

  initializeOptionalQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        if (params && params.subCategoryId) {
          this.filterForm.patchValue({
            subCategoryId: params.subCategoryId,
          });
          this.getSellerProduct();
          this.getSubCategoryName(params.subCategoryId);
        }
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }

  getSellerPageBannerImages = () => {
    this.bannerService
      .getBannerImages(Page.SellerPage)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.banners = res.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  };

  getSubCategoryTree = () => {
    this.subcategoryService
      .getSubCategoryTree()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.categoryTree = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  };

  getSellerProduct() {
    let id = this.sellerId;
    this.loading = true;
    let query = this.filterForm.value;
    this.loading = true;
    if (!query.subCategoryId) {
      delete query.subCategoryId;
    }
    this.productService
      .getSellersGetByUser(id, query)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res.data;
          this.filterForm.patchValue({
            pageNumber: res.pageNumber,
            pageSize: res.pageSize,
            totalRecords: res.totalRecords,
          });
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });
  }

  getMoreSellerProduct() {
    if (
      this.totalPages.length > this.filterForm.value.pageNumber &&
      this.loading == false
    ) {
      let query = this.filterForm.value;
      query.pageNumber = query.pageNumber + 1;
      this.loading = true;
      if (!query.subCategoryId) {
        delete query.subCategoryId;
      }
      let id = this.sellerId;
      this.loading = true;
      this.productService
        .getSellersGetByUser(id, query)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.list = [...this.list, ...res.data];
            this.filterForm.patchValue({
              pageNumber: res.pageNumber,
              pageSize: res.pageSize,
              totalRecords: res.totalRecords,
            });
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.page.handleError(err);
          },
        });
    }
  }

  getSellerDetails() {
    this.partnerService
      .getSellersById(this.sellerId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.breadcrumbs[2].title = res.data.fullName;
          this.sellerDetails = res.data;
          setTimeout(() => {
            this.page.hideLoader();
          }, 1000);
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  onFilterChange() {
    this.filter = false;
  }
  showFilter() {
    this.filter = !this.filter;
  }

  get totalPages(): any {
    let n: any = Math.ceil(
      this.filterForm.value.totalRecords / this.filterForm.value.pageSize
    );
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }

  getSubCategoryName(id: any) {
    this.subcategoryService
      .getSubCategoryById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          let data: Subcategory = res.data;
          this.breadcrumbs[3].title = data.name;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
}
