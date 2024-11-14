import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
@Component({
  selector: 'app-category-section',
  templateUrl: './category-section.component.html',
  styleUrls: ['./category-section.component.scss'],
})
export class CategorySectionComponent implements OnInit, OnDestroy {
  list: Category[] = [];
  loading: boolean = true;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public categoryService: CategoryService,
    private page: PageService
  ) {}

  ngOnInit(): void {
    this.categoryService
      .getTopCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
