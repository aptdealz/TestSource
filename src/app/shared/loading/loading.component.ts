import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  private page = inject(PageService);

  private ngUnsubscribe$ = new Subject<void>();
  loading = false;
  message = '';
  height = 300;
  ngOnInit(): void {
    setTimeout(() => {
      this.getLoadingStatus();
    }, 0);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getLoadingStatus = () => {
    this.page
      .getLoadingStatus()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.loading = res.loading;
        this.message = res.message ?? 'Loading...';
        this.height = res.height ?? 300;
      });
  };
}
