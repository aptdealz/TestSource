import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-dialog/confirm-dialog.component';
import { ErrorHandleComponent } from 'src/app/shared/modals/error-handle/error-handle.component';
import { UpgradePlanComponent } from 'src/app/shared/modals/upgrade-plan/upgrade-plan.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss'],
})
export class MySubscriptionComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'My Subscription', path: '' },
  ];
  displayedColumns: string[] = [
    'SrNo',
    'PlanInfo',
    'BillingCycle',
    'nextChargeDate',
    'razorPaySubscriptionId',
    'status',
    'button',
  ];
  isLoaded = false;
  hideSubscriptionPlan = environment.hideSubscriptionPlan;
  @ViewChild(MatSort) sort!: MatSort;
  list: any = [];
  selectedSubscription: any = null;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    private _liveAnnouncer: LiveAnnouncer,
    public subscriptionService: SubscriptionService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getData() {
    this.subscriptionService
      .getAllMySubscriptions()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (value) => {
          this.isLoaded = true;
          this.list = value.data;
          this.list = new MatTableDataSource(this.list);
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }

  public doFilter = (event: any) => {
    this.list.filter = event.target.value.trim().toLocaleLowerCase();
  };
  reset(event:any){
    if(event.target.value == ''){
      this.list.filter = ''
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  payLink(link: any) {
    window.open(link, '_blank');
  }

  openUpgradePlanModal(item: any) {
    this.selectedSubscription = item;
    this.selectedSubscription = item;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'upgrade-dialog';
    dialogConfig.data = {currentPlan: this.selectedSubscription};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(UpgradePlanComponent, {
      ...dialogConfig
    });
   /*  const modalRef = this.modalService.open(UpgradePlanComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.currentPlan = this.selectedSubscription; */
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result?.newSubscriptionPlanId) {
           this.page.showLoader();
          this.subscriptionService
            .upgradePlan(result)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe({
              next: (res) => {
                if (res.succeeded && res.data && res.data.paymentURL) {
                  this.page.showSuccessToast(res.message);
                  window.open(res.data.paymentURL, '_blank');
                } else {
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.panelClass = 'error-dialog';
                  dialogConfig.data = {text: res.message, };
                  dialogConfig.disableClose =true;
                  const dialogRef = this.dialog.open(ErrorHandleComponent, {
                    ...dialogConfig
                  });
                }
               this.page.hideLoader();
              },
              error: (err: any) => {
               this.page.hideLoader();
                const dialogConfig = new MatDialogConfig();
                dialogConfig.panelClass = 'error-dialog';
                dialogConfig.data = {text: err.message, };
                dialogConfig.disableClose =true;
                const dialogRef = this.dialog.open(ErrorHandleComponent, {
                  ...dialogConfig
                });

                this.page.handleError(err);
              },
            });
        }
      },
      (reason) => {}
    );
  }

  cancelPlan() {
     this.page.showLoader();
    this.subscriptionService
      .cancelSubscription({
        userSubscriptionPlanId:
          this.selectedSubscription.userSubscriptionPlanId,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.getData();
            this.page.showSuccessToast('Subscription Cancelled Successfully');
          } else {
            const dialogConfig = new MatDialogConfig();
                dialogConfig.panelClass = 'error-dialog';
                dialogConfig.data = {text: res.message, };
                dialogConfig.disableClose =true;
                const dialogRef = this.dialog.open(ErrorHandleComponent, {
                  ...dialogConfig
                });
          }
         this.page.hideLoader();
        },
        error: (err: any) => {
         this.page.hideLoader();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'error-dialog';
          dialogConfig.data = {text: err.message, };
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(ErrorHandleComponent, {
            ...dialogConfig
          });
          this.page.handleError(err);
        },
      });
  }

  openConfirm(item: any) {
    this.selectedSubscription = item;
    let text = 'Cancel Subscription';
    let message: any = 'Are you sure you want to cancel your subscription?';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message, title: text};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
      (reason) => {
        if (reason == 'yes') {
          this.cancelPlan();
        }
      }
    );
  }
}
