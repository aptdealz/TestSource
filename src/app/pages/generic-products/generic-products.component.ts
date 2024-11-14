import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { Page } from 'src/app/enums/page.enum';
import { environment } from 'src/environments/environment';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BannerResponse } from 'src/app/models/banner.model';
import { BannerService } from 'src/app/services/banner.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { CategoryTree } from 'src/app/models/category.model';
import { ProductService } from 'src/app/services/product.service';
import { GenericProduct } from 'src/app/models/generic-product.model';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-generic-products',
  templateUrl: './generic-products.component.html',
  styleUrls: ['./generic-products.component.scss'],
})
export class GenericProductsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '' },
  ];
  showCart: boolean = false;
  list: GenericProduct[] = [];
  pageTitle: string = 'Products';
  categoryTree: CategoryTree[] = [];
  filterForm: any;
  filter: boolean = false;
  searchkeyword = '';
  banners: BannerResponse[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  showLoading:boolean = true;
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public router: Router,
    public fb: FormBuilder,
    public page: PageService,
    public metaService: Meta,
    public bannerService: BannerService,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService,
    public productService: ProductService
  ) {
    this.filterForm = this.fb.group({
      pageSize: environment.pageSize,
      pageNumber: 1,
      totalRecords: 1,
      SubCategoryUrlName: '',
      Title: '',
    });
  }

  ngOnInit(): void {
     this.page.showLoader();
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
      .getBannerImages(Page.GenericProductListingPage)
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
     this.page.showLoader();
    let param = this.route.params
    let queryParams = this.route.queryParams
    combineLatest([
      param,
      queryParams
    ]).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: ([resParam, resQuery]) => {
       if(resParam){
        if (resParam['subcategory']) {
          this.breadcrumbs = [
            { title: 'Home', path: '/' },
            { title: 'Categories', path: `/all-categories` },
            {
              title: this.transformString(resParam['category']),
              path: `/category/${resParam['category']}`,
            },
            { title: this.transformString(resParam['subcategory']), path: '' },
          ];
        }
        this.filterForm.patchValue({
          SubCategoryUrlName: resParam['subcategory'],
        });
       }
       if(resQuery){
        this.filterForm.patchValue({
          pageNumber: 1,
          Title: resQuery.Title,
        });
        if (resQuery.Title) {
          this.searchkeyword = resQuery.Title;
        }
       }
       this.getProducts(this.filterForm.value);
       this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.showErrorToast(err);
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });
    /*   this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        if (params['subcategory']) {
          this.breadcrumbs = [
            { title: 'Home', path: '/' },
            { title: 'Categories', path: `/all-categories` },
            {
              title: this.transformString(params['category']),
              path: `/category/${params['category']}`,
            },
            { title: this.transformString(params['subcategory']), path: '' },
          ];
        }
        this.filterForm.patchValue({
          SubCategoryUrlName: params['subcategory'],
        });
        this.getProducts(this.filterForm.value);
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    });

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.filterForm.patchValue({
          pageNumber: 1,
          Title: params.Title,
        });
        if (params.Title) {
          this.searchkeyword = params.Title;
        }
        this.getProducts(this.filterForm.value);
        this.page.hideLoader();
      },
      error: (err: any) => {
        this.page.hideLoader();
        this.page.handleError(err);
      },
    }); */
  }

  transformString(inputString: any) {
    const words = inputString.split('-');
    const transformedString = words
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return transformedString;
  }
  onFilterChange() {
    this.filter = false;
  }

  showFilter() {
    this.filter = !this.filter;
  }

  getProducts(query: any) {
     this.page.showLoader();
    if (!query.SubCategoryUrlName) {
      delete query.SubCategoryUrlName;
    }
    if (!query.Title) {
      delete query.Title;
    }
    if (query.SubCategoryUrlName) {
      this.categoryService
        .getSubCategoryByUrlName(query.SubCategoryUrlName)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.titleService.setTitle(
              (res[0].seoTitle ?? this.pageTitle) + ''
            );
            this.metaService.updateTag({
              name: 'description',
              content: res[0].metaDescription ?? '',
            });
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    } else {
    }
    this.productService
      .getGenericProducts(query)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res.data;
          this.showLoading = false;
           this.filterForm.patchValue({
            pageNumber: res.pageNumber,
            pageSize: res.pageSize,
            totalRecords: res.totalRecords,
          }); 
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  addCart(i: any) {
    this.showCart = true;
  }
  get totalPages(): any {
    let n: any = Math.ceil(
      this.filterForm?.value?.totalRecords / this.filterForm?.value?.pageSize
    );
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }

  getMoreProducts() {
    if (this.totalPages.length > this.filterForm.value.pageNumber) {
      let query = this.filterForm.value;
      query.pageNumber = query.pageNumber + 1;
      if (!query.SubCategoryUrlName) {
        delete query.SubCategoryUrlName;
      }
      this.productService
        .getGenericProducts(query)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.list = [...this.list, ...res.data];
            this.filterForm.patchValue({
              pageNumber: res.pageNumber,
              pageSize: res.pageSize,
              totalRecords: res.totalRecords,
            });
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    }
  }

  search() {
    this.router.navigateByUrl('/product?Title=' + this.searchkeyword);
  }
}
