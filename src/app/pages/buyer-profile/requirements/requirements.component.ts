import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { RequirementService } from 'src/app/services/requirement.service';
import { Requirement } from 'src/app/models/requirement.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirenmentsComponent implements OnInit, OnDestroy {
  requirements: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'requirementNo',
    'title',
    'categoryName',
    'subCategories',
    'status',
    'totalPriceEstimation',
    'quantity',
    'created',
    'button',
  ];
  isLoaded = false;
  requirementTypeControl = new FormControl();
  @ViewChild(MatSort) sort!: MatSort;
  type: any;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    private _liveAnnouncer: LiveAnnouncer,
    public requirementService: RequirementService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllData('activeRequirements');
    this.requirementTypeControl.setValue('activeRequirements');
    this.requirementTypeControl.valueChanges.subscribe({
      next: (res) => {
        this.getAllData(res);
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
  getAllData(type: any) {
    if (type == 'activeRequirements') {
      this.type = 'activeRequirements';
      this.requirementService
        .getAllMyActiveRequirements()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (requirementsRes) => {
            let data: Requirement[] = requirementsRes.data;
            this.requirements = new MatTableDataSource(data);
            this.requirements.sort = this.sort;
            this.isLoaded = true;
          },
          error: (err: any) => {
            this.requirements = [];
            this.page.handleError(err);
          },
        });
    } else {
      this.type = 'previousRequirements';
      this.requirementService
        .getAllMyPreviousRequirements()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (requirementsRes) => {
            let data: Requirement[] = requirementsRes.data;
            this.requirements = new MatTableDataSource(data);
            this.requirements.sort = this.sort;
            this.isLoaded = true;
          },
          error: (err: any) => {
            this.requirements = [];
            this.page.handleError(err);
          },
        });
    }
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

  delete(requirementId: string) {
    let message = 'Are you sure you want to delete this requirement?';

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
     (result) => {
        if (result == 'yes') {
          this.page.showLoader();
          this.requirementService
            .deleteRequirement(requirementId)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                if (res.message) {
                  this.getAllData(this.requirementTypeControl.value);
                  this.page.showSuccessToast(res.message);
                } else if (res.errors) {
                  this.page.showErrorToast(res.errors.join('<br>'));
                }
                 this.page.hideLoader();
              },
              error: (err: any) => {
                 this.page.hideLoader();
                this.page.showErrorToast(err);
              },
            });
        }
      }
    );
  }
  reset(event:any){
    if(event.target.value == ''){
      this.requirements.filter = ''
    }
  }
}
