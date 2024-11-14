import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { GrievanceService } from 'src/app/services/grievance.service';
import { UserService } from 'src/app/services/user.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { Grievance } from 'src/app/models/grievance.model';
@Component({
  selector: 'app-grievance-buyer-details',
  templateUrl: './grievance-buyer-details.component.html',
  styleUrls: ['./grievance-buyer-details.component.scss'],
})
export class GrievanceBuyerDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private _location = inject(Location);
  private titleService = inject(Title);
  private grievanceService = inject(GrievanceService);
  private page = inject(PageService);
  private userService = inject(UserService);
  userId = this.userService.getUserId();

  private ngUnsubscribe$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Grievance', path: '' },
  ];
  pageTitle: string = 'Buyer Grievance';
  id = '';
  data!: Grievance;
  buyerForm: any;
  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.createForm();
    this.getRouteParams();
  }
  createForm = () => {
    this.buyerForm = this.fb.group({
      response: ['', Validators.required],
    });
  };
  getRouteParams = () => {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.id = params['id'];
        this.getGrievanceDetails();
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
    if(this.page.isPlatformBrowser()){
      setInterval(() => {
        this.getGrievanceDetails();
      }, 1000);
    }
  };

  getGrievanceDetails() {
    this.grievanceService
      .getBuyerGrievanceDetails(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.data = res.data;
        },
        error: (err) => {
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  back() {
    this._location.back();
  }
  submit() {
    let data = this.buyerForm.value;
    data.grievanceId = this.id;
    this.buyerForm.reset();
    this.grievanceService
      .submitBuyerGrievance(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.getGrievanceDetails();
          } else {
            this.page.showErrorToast(res.message);
          }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
}
