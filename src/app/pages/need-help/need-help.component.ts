import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { PageService } from 'src/app/services/page.service';
import { StaticPagesService } from 'src/app/services/static-pages.service';
@Component({
  selector: 'app-need-help',
  templateUrl: './need-help.component.html',
  styleUrls: ['./need-help.component.scss'],
})
export class NeedHelpComponent implements OnInit, OnDestroy {
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Support', path: '' },
  ];
  pageTitle: string = 'Support';
  data: any;
  keyword = '';
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.page.setTitle(this.pageTitle);
    this.page.showLoader();
    this.spService
      .getFaq()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.page.hideLoader();
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
  getFaqs() {
    if (this.data) {
      return this.data.filter((item: any) => {
        if (this.keyword) {
          return (
            item?.question.toLowerCase().includes(this.keyword) ||
            item?.answer.toLowerCase().includes(this.keyword)
          );
        } else {
          return true;
        }
      });
    } else {
      return [];
    }
  }
}
