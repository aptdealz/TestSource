import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { Subcategory } from 'src/app/models/subcategory.model';
@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'],
})
export class SubcategoriesComponent implements OnInit, OnDestroy {
  categoryName: any;
  category!: Category;
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Categories', path: '/all-categories' },
    { title: '', path: '' },
  ];
  list: Subcategory[] = [];
  loading: boolean = true;
  type: any = '';
  pageTitle: string = 'Sub Categories';
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private titleService: Title,
    public page: PageService,
    private metaService: Meta,
    public categoryService: CategoryService,
    public subcategoryService: SubcategoryService
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.type = this.route.snapshot.paramMap.get('type');

    if (!this.type) {
      this.type = 'products';
    }
    if (this.type == 'brands') {
      this.breadcrumbs[1].path = '/brands/categories';
    }
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((params) => {
         this.page.showLoader();
        const id = params['id'];

        this.subcategoryService
          .getSubCategories(id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.list = res;
              this.loading = false;
              this.getCategory(id);
              this.page.hideLoader();
            },
            error: (err: any) => {
              this.loading = false;
              this.page.hideLoader();
              this.page.handleError(err);
            },
          });
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  getCategory(id: any) {
     this.page.showLoader();
    this.categoryService
      .getCategoriesByUrlName(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.category = res[0];
          this.categoryName = res[0].h1Tag ? res[0].h1Tag : res[0].name;
          this.breadcrumbs[2].title = this.categoryName;
          this.titleService.setTitle(
            (res[0].seoTitle ?? this.categoryName) + ''
          );

          this.metaService.updateTag({
            name: 'description',
            content: res[0].metaDescription,
          });
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  gotoProducts(subcategory: any) {
    this.router.navigate([
      '/product',
      this.category.urlName,
      subcategory.urlName,
    ]);
  }
}
