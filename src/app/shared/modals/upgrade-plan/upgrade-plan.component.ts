import { Component, OnInit, Input, OnDestroy ,Inject} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { AllSubscription } from 'src/app/models/subscription.model';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss'],
})
export class UpgradePlanComponent implements OnInit, OnDestroy {
  subscriptionPlans: AllSubscription[] = [];
  /* @Input() currentPlan: any; */
  selectedNewPlanType: any = null;
  selectedNewPlanId: any = '';
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    public subscriptionService: SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UpgradePlanComponent>
  ) {}

  ngOnInit(): void {
    this.subscriptionService
      .getAllSubscription()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.subscriptionPlans = res.data;
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  onPlanSelected(event: any) {
    this.selectedNewPlanId = '';
    this.selectedNewPlanType = this.subscriptionPlans.find((item: any) => {
      return (item.basePlanId = event.target.value);
    });
  }

  upgrade() {
    this.dismissModal({
      currentUserSubscriptionPlanId: this.data.currentPlan.userSubscriptionPlanId,
      newSubscriptionPlanId: this.selectedNewPlanId,
    });
  }
  dismissModal(message: any) {
    this.dialogRef.close(message);
  }
  
  //dismissModal = (message: string) => this.activeModal.dismiss(message);
}
