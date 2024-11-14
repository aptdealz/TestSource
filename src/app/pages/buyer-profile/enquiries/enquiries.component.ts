import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageService } from 'src/app/services/page.service';
import { Subject, takeUntil } from 'rxjs';
import { EnquiryService } from 'src/app/services/enquiry.service';
@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.scss'],
})
export class EnquiriesComponent implements OnInit, OnDestroy {
  requirements: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'productImage',
    'title',
    'phoneNumber',
    'description',
    'quantity',
    'created',
  ];
  isLoaded = false;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    public enquiryService: EnquiryService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    this.enquiryService
      .getMyEnquiries()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.requirements = res.data;
          this.requirements = new MatTableDataSource(this.requirements);
          this.requirements.sort = this.sort;
          this.requirements.filterPredicate = (data: any, filter: any) => {
            const searchValue = filter.trim().toLowerCase();
            const valuesToSearch = [
              'sellerProduct.title',
              'phoneNumber',
              'description',
              'quantity',
            ];
            return valuesToSearch.some((path) =>
              this.getValueFromNestedObject(data, path)
                .toLowerCase()
                .includes(searchValue)
            );
          };
        },
        error: (err: any) => {
          this.requirements = [];
          this.page.handleError(err);
        },
      });
   
    this.isLoaded = true;
  }

  getValueFromNestedObject(obj: any, path: any) {
    const props = path.split('.');
    let value = obj;
    for (const prop of props) {
      value = value[prop];
    }
    return value.toString();
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
