import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RequirementService } from 'src/app/services/requirement.service';
import { Quote } from 'src/app/models/quote.model';

@Component({
  selector: 'app-view-quotes',
  templateUrl: './view-quotes.component.html',
  styleUrls: ['./view-quotes.component.scss'],
})
export class ViewQuotesComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Quotes', path: '' },
  ];
  list: any = [];
  loading: boolean = true;
  displayedColumns: string[] = [
    'SrNo',
    'quoteNo',
    'requirementTitle',
    'totalQuoteAmount',
    'quantity',
    'button',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  pageTitle: string = 'View Quotes';
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private titleService: Title,
    private page: PageService,
    private requirementService: RequirementService
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((params) => {
        const id = params['id'];
        this.getQuote(id);
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getQuote(id: any) {
    this.requirementService
      .getQuotes(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          let data: Quote[] = res.data;
          this.list = new MatTableDataSource(data);
          this.list.sort = this.sort;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
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
    this.list.filter = event.target.value.trim().toLocaleLowerCase();
  };
  reset(event:any){
    if(event.target.value == ''){
      this.list.filter = ''
    }
  }
}
