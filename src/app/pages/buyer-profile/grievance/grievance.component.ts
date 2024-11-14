import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageService } from 'src/app/services/page.service';
import { AddGrievanceComponent } from 'src/app/shared/modals/add-grievance/add-grievance.component';
import { Subject, takeUntil } from 'rxjs';
import { RoleService } from 'src/app/services/role.service';
import { SellerService } from 'src/app/services/seller.service';
import { GrievanceResponse } from 'src/app/models/grievance.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { PagedResponseModel } from 'src/app/models/generic/paged-response.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.scss'],
})
export class GrievanceComponent implements OnInit, OnDestroy {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private sellerService = inject(SellerService);
  private buyerService = inject(BuyerService);
  private dialog = inject(MatDialog);
  requirements: any = [];
  displayedColumns: string[] = [
    'grievanceNo',
    'orderNo',
    'grievanceTypeDescr',
    'statusDescr',
    'created',
    'button',
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
    if (this.roleService.isBuyer()) {
      this.buyerService
        .getBuyerGrievance()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: PagedResponseModel<GrievanceResponse[]>) => {
            this.requirements = res.data;
            this.requirements = new MatTableDataSource(this.requirements);
            this.requirements.sort = this.sort;
            this.requirements.filterPredicate = (data: any, filter: any) => {
              const searchValue = filter.trim().toLowerCase();
              const valuesToSearch = [
                'grievanceNo',
                'orderNo',
                'grievanceTypeDescr',
                'statusDescr',
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
    } else {
      this.sellerService
        .getSellerGrievance()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.requirements = res.data;
            this.requirements = new MatTableDataSource(this.requirements);
            this.requirements.sort = this.sort;
            this.requirements.filterPredicate = (data: any, filter: any) => {
              const searchValue = filter.trim().toLowerCase();
              const valuesToSearch = [
                'grievanceNo',
                'orderNo',
                'grievanceTypeDescr',
                'statusDescr',
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
    }

   

    this.isLoaded = true;
  }

  grievanceModal() {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'grievance-dialog-lg';
    dialogConfig.data = {grievanceForId: '', grievanceForName: ''};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(AddGrievanceComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllData();
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

  getValueFromNestedObject(obj: any, path: any) {
    const props = path.split('.');
    let value = obj;
    for (const prop of props) {
      value = value[prop];
    }
    return value.toString();
  }
  reset(event:any){
    if(event.target.value == ''){
      this.requirements.filter = ''
    }
  }
}
