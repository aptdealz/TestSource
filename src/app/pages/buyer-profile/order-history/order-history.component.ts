import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageService } from 'src/app/services/page.service';
import { Subject, takeUntil } from 'rxjs';
import { BuyerService } from 'src/app/services/buyer.service';
import { Orders } from 'src/app/models/orders.model';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  requirements: any = [];
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
    public buyerService: BuyerService
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    this.buyerService
      .getBuyerOrders()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          const quotesRes: Orders[] = res.data;
          this.requirements = new MatTableDataSource(quotesRes);
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
