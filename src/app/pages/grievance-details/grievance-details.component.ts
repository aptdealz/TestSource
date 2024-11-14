import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { GrievanceService } from 'src/app/services/grievance.service';
import { UserService } from 'src/app/services/user.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
@Component({
  selector: 'app-grievance-details',
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.scss'],
})
export class GrievanceDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private _location = inject(Location);
  private titleService = inject(Title);
  private grievanceService = inject(GrievanceService);
  private page = inject(PageService);
  private userService = inject(UserService);

  userId = this.userService.getUserId();

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Grievance', path: '' },
  ];
  pageTitle: string = 'Product Details';
  id: any;
  data: any;
  sellerForm!: FormGroup;
  private ngUnsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.createForm();
    this.getRouteParams();
  }
  createForm = () => {
    this.sellerForm = this.fb.group({
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
      .getSellerGrievanceDetails(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.data = res.data;
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
  back() {
    this._location.back();
  }
  submit() {
    let data = this.sellerForm.value;
    data.grievanceId = this.id;
    this.sellerForm.reset();
    this.grievanceService
      .submitSellerGrievance(data)
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
