import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { UserService } from 'src/app/services/user.service';
import { LeadService } from 'src/app/services/lead.service';
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements OnInit, OnDestroy {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private userService = inject(UserService);
  private leadService = inject(LeadService);

  userId = this.userService.getUserId();

  requirements: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'name',
    'phoneNumber',
    'description',
    'quantity',
    'created'
  ];
  isLoaded = false;
  @ViewChild(MatSort) sort!: MatSort;
  private ngUnsubscribe$ = new Subject<void>();
  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    this.leadService
      .getLeads({ UserId: this.userId })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.requirements = res.data;
          
          this.requirements = new MatTableDataSource(this.requirements);
          this.requirements.sort = this.sort;
          this.isLoaded = true;
        },
        error: (err: any) => {
          this.requirements = [];
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
