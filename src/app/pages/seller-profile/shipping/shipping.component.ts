import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { SellerService } from 'src/app/services/seller.service';
import { GetOrdersForSeller } from 'src/app/models/orders.model';
@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnInit, OnDestroy {
  requirements: any = [];
  categories: any = [];
  subCategories: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'title',
    'orderStatusDescr',
    'paidAmount',
    'quantity',
    'created',
    'button',
  ];
  isLoaded = false;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    private _liveAnnouncer: LiveAnnouncer,
    public sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    this.sellerService
      .getSellerOrders()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (quotesRes) => {
          let data: GetOrdersForSeller[] = quotesRes.data;
          this.requirements = new MatTableDataSource(data);
          this.requirements.sort = this.sort;
          this.isLoaded = true;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public doFilter = (event: any) => {
    this.requirements.filter = event.target.value.trim().toLocaleLowerCase();
  };
  reset(event:any){
    if(event.target.value == ''){
      this.requirements.filter = ''
    }
  }
}
