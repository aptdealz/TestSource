import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { PageService } from 'src/app/services/page.service';

import { replaceNewlineWithBr } from 'src/app/helpers/generic.helper.';
import { tnc } from 'src/app/models/static-pages.model';
@Component({
  selector: 'app-return-policy',
  templateUrl: './return-policy.component.html',
  styleUrls: ['./return-policy.component.scss'],
})
export class ReturnPolicyComponent implements OnInit, OnDestroy {
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  private ngUnsubscribe$ = new Subject<void>();
  pageTitle: string = 'Return Policy';

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Return Policy', path: '' },
  ];
  data!: tnc;
  loading = true;
  ngOnInit(): void {
    this.page.setTitle(this.pageTitle);
    this.page.showLoader();
    this.spService
      .getTnc()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res.data;
            this.data.retrunPolicy = replaceNewlineWithBr(
              res.data.retrunPolicy
            );
            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Return policy not found.'
            );
          }
        },
        error: (err: any) => {
          this.loading = this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
