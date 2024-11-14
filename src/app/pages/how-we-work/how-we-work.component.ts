import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
@Component({
  selector: 'app-how-we-work',
  templateUrl: './how-we-work.component.html',
  styleUrls: ['./how-we-work.component.scss'],
})
export class HowWeWorkComponent implements OnInit, OnDestroy {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'How We Work', path: '' },
  ];
  pageTitle: string = 'B2B Online Marketplace for Buyer in India| Retailers Marketplace';
  data: any;
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.titleService.setTitle(this.pageTitle);
    this.meta.updateTag({
      name: 'description',
      content:
        'Quotesouk works as the best B2B Online Marketplace for Buyers in India by connecting suppliers and buyers. Read more here to understand getting multiple quotes & best deals.',
    });
    this.page.showLoader();
    this.spService
      .getHowWeWork()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.data = res;
          this.page.hideLoader();
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
}
