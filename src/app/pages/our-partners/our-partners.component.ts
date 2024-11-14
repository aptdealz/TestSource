import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { PartnerService } from 'src/app/services/partner.service';
import { Seller } from 'src/app/models/seller.model';
import { SellerService } from 'src/app/services/seller.service';
@Component({
  selector: 'app-our-partners',
  templateUrl: './our-partners.component.html',
  styleUrls: ['./our-partners.component.scss'],
})
export class OurPartnersComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Our Partners', path: '' },
  ];
  loading: boolean = true;
  list: Seller[] = [];
  pageTitle: string = 'Best Ecommerce Website for Buyer in India  | Our Partners';
  param: any;
  pageSize: any;
  pageNumber: any;
  totalRecords: any;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public router: Router,
    private meta: Meta,
    private page: PageService,
    private partnerService: PartnerService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content:
        'Best Ecommerce Website for Buyers in India brings you the best products and services. Learn more about Quotesouk\'s strategic partnerships here.',
    });

    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        let id = params['id'];
        if (id) {
          this.getAllSellersBySubCategoryId(id);
        } else {
          this.getAllSeller();
        }
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
  /*  initialize() {
    this.route.queryParams.subscribe((params) => {
      this.param = params;
      if (!params.PageSize) {
        this.getFirst();
      } else {
        this.pageNumber = this.param.pageNumber;
        this.pageSize = this.param.pageSize;

      }
    });
  }
  getFirst() {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        PageSize: this.pageSize,
        PageNumber: this.pageNumber,
      },
      queryParamsHandling: 'merge',
    });
    this.getAllSeller();
  } */
  getAllSeller() {
    this.partnerService
      .getAllSellers()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }
  getAllSellersBySubCategoryId(id: any) {
    this.sellerService
      .getAllSellersBySubCategoryId(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });
  }
  get totalPages(): any {
    let n: any = Math.ceil(this.totalRecords / this.pageSize);
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }
  next() {
    this.pageNumber = parseInt(this.pageNumber) + 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        PageSize: this.pageSize,
        PageNumber: this.pageNumber,
      },
      queryParamsHandling: 'merge',
    });
    // this.initialize();
  }
  previous() {
    this.pageNumber = parseInt(this.pageNumber) - 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        PageSize: this.pageSize,
        PageNumber: this.pageNumber,
      },
      queryParamsHandling: 'merge',
    });
    // this.initialize();
  }
}
