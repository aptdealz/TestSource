import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { replaceNewlineWithBr } from 'src/app/helpers/generic.helper.';
import { tnc } from 'src/app/models/static-pages.model';
@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss'],
})
export class TermsConditionComponent implements OnInit, OnDestroy {
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  private ngUnsubscribe$ = new Subject<void>();
  pageTitle: string = 'Terms & Conditions';

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Terms & Condition', path: '' },
  ];
  data!: tnc;
  loading = true;
  ngOnInit(): void {
    this.page.setTitle(this.pageTitle);
    this.loading = this.page.showLoader(false);
    this.spService
      .getTnc()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res?.data;
            this.data.tandC = replaceNewlineWithBr(res.data.tandC);
            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Terms & condition not found.'
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
