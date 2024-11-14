import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/enums/page.enum';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BannerResponse } from 'src/app/models/banner.model';
import { BannerService } from 'src/app/services/banner.service';
import { ProductService } from 'src/app/services/product.service';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { CategoryTree } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Promoted products', path: '/promoted-products' },
    { title: '', path: '' },
  ];
  showCart: boolean = false;
  list: Product[] = [];
  loading: boolean = true;
  pageTitle: string = 'Products';
  categoryTree: CategoryTree[] = [];
  param: any;
  pageSize: any;
  pageNumber: any;
  totalRecords: any;
  filterForm: any;
  filter: boolean = false;
  banners: BannerResponse[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public router: Router,
    public fb: FormBuilder,
    public metaService: Meta,
    private page: PageService,
    public bannerService: BannerService,
    public productService: ProductService,
    public subcategoryService: SubcategoryService
  ) {
    this.filterForm = this.fb.group({
      pageSize: environment.pageSize,
      pageNumber: 1,
      totalRecords: 1,
      subCategoryId: '',
      Title: '',
      District: '',
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
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
    this.bannerService
      .getBannerImages(Page.ProductListingPage)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.banners = res.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.initialize();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  initialize() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.filterForm.patchValue({
          subCategoryId: params.subCategoryId,
          pageSize: 20,
          pageNumber: 1,
          totalRecords: 1,
          Title: params.Title,
          District: params.District,
        });
        this.breadcrumbs[2].title = params.Title;
        this.getProducts(this.filterForm.value);
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }

  handleEvent(event: any) {
    //this.pageSize = event;
    this.filterForm.patchValue({
      pageSize: event,
      pageNumber: 1,
    });
  }

  showFilter() {
    this.filter = !this.filter;
  }
  onFilterChange() {
    this.filter = false;
  }

  getProducts(query: any) {
    this.loading = true;
    if (!query.subCategoryId) {
      delete query.subCategoryId;
    }
    if (!query.Title) {
      delete query.Title;
    }
    if (!query.District) {
      delete query.District;
    }

    if (query.subCategoryId) {
      this.subcategoryService
        .getSubCategoryById(query.subCategoryId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.breadcrumbs[2].title = res.data.name;
            this.titleService.setTitle((res.data.seoTitle ?? '') + '');
            this.metaService.updateTag({
              name: 'description',
              content: res.data.metaDescription ?? '',
            });
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    } else {
    }

    this.productService
      .getAllSellerProducts(query)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res?.data;
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

  getMoreProducts() {
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
      this.productService
        .getAllSellerProducts(query)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.list = [...this.list, ...res?.data];
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

  addCart(i: any) {
    this.showCart = true;
  }

  get totalPages(): any {
    let n: any = Math.ceil(
      this.filterForm.value.totalRecords / this.filterForm.value.pageSize
    );
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }
}
