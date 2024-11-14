import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { QuotesService } from 'src/app/services/quotes.service';
import { Quote } from 'src/app/models/quote.model';
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit, OnDestroy {
  quotes: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'quoteNo',
    'requirementTitle',
    'totalQuoteAmount',
    'requestedQuantity',
    'created',
    'button',
  ];
  isLoaded = false;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    private _liveAnnouncer: LiveAnnouncer,
    public quotesService: QuotesService
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    this.quotesService
      .getBuyerQuotes()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          let data: Quote[] = res.data;
          this.quotes = new MatTableDataSource(data);
          this.quotes.sort = this.sort;
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
    this.quotes.filter = event.target.value.trim().toLocaleLowerCase();
  };
  reset(event:any){
    if(event.target.value == ''){
      this.quotes.filter = ''
    }
  }
}
