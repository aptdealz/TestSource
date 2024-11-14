import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { SubscriptionService } from 'src/app/services/subscription.service';
@Component({
  selector: 'app-my-subscription-details',
  templateUrl: './my-subscription-details.component.html',
  styleUrls: ['./my-subscription-details.component.scss'],
})
export class MySubscriptionDetailsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'My Subscription', path: '/my-subscription' },
    { title: 'My Subscription Details', path: '' },
  ];

  displayedColumns: string[] = [
    'SrNo',
    'planName',
    'totalAmount',
    'planDuration',
    'nextChargeDate',
    'razorPay',
    'paymentDetails',
  ];
  isLoaded = false;
  @ViewChild(MatSort) sort!: MatSort;
  list: any;
  id: any;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    private _liveAnnouncer: LiveAnnouncer,
    public route: ActivatedRoute,
    public subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.id = params['id'];
        this.getData();
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
  getData() {
    this.subscriptionService
      .getPaymentsBySubscriptionId(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (value: any) => {
          this.isLoaded = true;
          this.list = value.data;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }

  public doFilter = (event: any) => {
    this.list.filter = event.target.value.trim().toLocaleLowerCase();
  };
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
