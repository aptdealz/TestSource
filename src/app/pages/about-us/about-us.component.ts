import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import SwiperCore, {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
} from 'swiper';
import { PageService } from 'src/app/services/page.service';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { AboutResponse } from 'src/app/models/static-pages.model';
SwiperCore.use([Navigation, Autoplay, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  private ngUnsubscribe$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '' },
  ];
  pageTitle: string = 'Buyers Online Ecommerce Platform in India | About Us';
  data!: AboutResponse;
  configTest: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      720: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  };
  loading = true;
  ngOnInit(): void {
    this.page.setTitleAndDescription(
      this.pageTitle,
      'Quotesouk is a Buyers Online Ecommerce Platform in India that connects B2B buyers and Sellers by ensuring total security and total transparency.'
    );
    this.loading = this.page.showLoader(false);
    this.spService
      .getAboutUs()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res) {
          this.data = res;

          this.loading = this.page.hideLoader();
        } else {
          this.loading = this.page.showLoader(false, 'No data found');
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
