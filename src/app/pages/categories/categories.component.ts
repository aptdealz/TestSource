import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Categories', path: '' },
  ];
  list: Category[] = [];
  type: any = '';
  loading: boolean = true;
  pageTitle: string = 'Categories';
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    public page: PageService,
    public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
     this.page.showLoader();
    this.titleService.setTitle(this.pageTitle);
    this.type = this.route.snapshot.paramMap.get('type');
    if (!this.type) {
      this.type = 'products';
    }
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res;
          this.loading = false;
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.loading = false;
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
