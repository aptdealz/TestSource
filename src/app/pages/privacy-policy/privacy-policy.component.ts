import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { StaticPagesService } from 'src/app/services/static-pages.service';
import { replaceNewlineWithBr } from 'src/app/helpers/generic.helper.';
import { tnc } from 'src/app/models/static-pages.model';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  private ngUnsubscribe$ = new Subject<void>();
  pageTitle: string = 'Privacy Policy';

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Privacy Policy', path: '' },
  ];

  data!: tnc;
  loading = true;
  ngOnInit(): void {
    this.page.setTitle(this.pageTitle);
    /*this.loading = this.page.showLoader(false);
    this.spService
      .getTnc()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res.data;
            this.data.privacyPolicy = replaceNewlineWithBr(
              res.data.privacyPolicy
            );
            this.loading = this.page.hideLoader();
          } else {
            this.loading = this.page.showLoader(
              false,
              'Privacy policy not found.'
            );
          }
        },
        error: (err: any) => {
          this.loading = this.page.handleError(err);
        },
      });*/
  }

      toggleAccordion(event: MouseEvent) {
        const header = event.currentTarget as HTMLElement;
        const body = header.nextElementSibling as HTMLElement;
        const icon = header.querySelector('span');
        
        if (body) {
            // Toggle the 'show' class to display or hide the body
            body.classList.toggle('show');
            
            if (icon) {
                // Change the icon content based on the 'show' class
                icon.textContent = body.classList.contains('show') ? '-' : '+';
            }
        }
    }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
