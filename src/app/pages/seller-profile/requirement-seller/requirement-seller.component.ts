import { LiveAnnouncer } from '@angular/cdk/a11y';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { RequirementService } from 'src/app/services/requirement.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-requirement-seller',
  templateUrl: './requirement-seller.component.html',
  styleUrls: ['./requirement-seller.component.scss'],
})
export class RequirementSellerComponent implements OnInit, OnDestroy {
  requirements: any = [];
  categories: Category[] = [];
  subCategories: any = [];
  displayedColumns: string[] = [
    'SrNo',
    'requirementNo',
    'title',
    'categoryName',
    'subCategories',
    'totalPriceEstimation',
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
    public categoryService: CategoryService,
    public requirementService: RequirementService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getAllData() {
    const categoryApi = this.categoryService.getCategories();
    const requirementsApi = this.requirementService.getSellerRequirements();
    forkJoin([categoryApi, requirementsApi]).subscribe(
      ([categoryRes, requirementsRes]: any) => {
        this.categories = categoryRes;
        this.requirements = requirementsRes.data;
        if(this.requirements){
        for (let index = 0; index < this.requirements?.length; index++) {
          const requirement = this.requirements[index];
          let categoryName = this.categories.filter(
            (category: any) => category.categoryId === requirement.category
          );
          if (categoryName.length > 0) {
            this.requirements[index].categoryName = categoryName[0].name;
          }
        }
       
        this.requirements = new MatTableDataSource(this.requirements);
        
        this.requirements.sort = this.sort;
      }
        this.isLoaded = true;
      },
      (err: any) => {
      }
    );
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
      (reason) => {
        if (reason == 'yes') {
           this.page.showLoader();
          this.requirementService
            .deleteRequirement(requirementId)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                if (res.message) {
                  this.page.showSuccessToast(res.message);
                  const index = this.requirements.data.indexOf(
                    (el: any) => el.requirementId === requirementId
                  );
                  this.requirements.data.splice(index, 1);
                  this.requirements._updateChangeSubscription();
                } else if (res.errors) {
                  this.page.showErrorToast(res.errors.join('<br>'));
                }
                this.page.hideLoader();
              },
              error: (err: any) => {
                this.page.showErrorToast(err);
                this.page.hideLoader();
                this.page.handleError(err);
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
