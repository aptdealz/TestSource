import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  inject,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { Blog } from 'src/app/models/blog.model';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private page = inject(PageService);
  private blogService = inject(BlogService);

  private ngUnsubscribe$ = new Subject<void>();
  @Output('fetchMore') fetchMore = new EventEmitter<any>();

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '' },
  ];

  throttle = 300;
  scrollDistance = 1;
  pageTitle: string = 'Blogs';
  data: Blog[] =[];
  response: any;
  totalRecords: any;
  searchKey: any = '';
  loading: boolean = true;
  filterForm!: FormGroup;
  ngOnInit(): void {
    this.createForm()
    this.page.setTitle(this.pageTitle);
    this.initialize();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  createForm = () => {
    this.filterForm = this.fb.group({
      pageSize: environment.pageSize,
      pageNumber: 1,
      totalRecords: 1,
      Title: '',
    });
  };

  initialize() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.filterForm.patchValue({
          pageNumber: 1,
          Title: params.Title,
        });
        this.getAll();
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }

  getSearchData() {
    this.filterForm.patchValue({
      Title: this.searchKey,
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        Title: this.filterForm.value.Title,
      },
      queryParamsHandling: 'merge',
    });
  }

  getAll() {
    let query = this.filterForm.value;
    if (!query.Title) {
      delete query.Title;
    }
    this.page.showLoader();
    this.blogService
      .getBlogEntries(query)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.response = res;
          this.filterForm.patchValue({
            pageNumber: this.response.pageNumber,
            pageSize: this.response.pageSize,
            totalRecords: this.response.totalRecords,
          });
          this.data = res.data;
           this.page.hideLoader();
        },
        error: (err: any) => {
          this.data = [];
          this.loading = false;
           this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  getArrayFromInt(num: any) {
    return Array.from({ length: num }, (_, i) => i + 1);
  }

  get totalPages(): any {
    let n: any = Math.ceil(
      this.filterForm.value.totalRecords / this.filterForm.value.pageSize
    );
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }

  getMore() {
    if (
      this.totalPages.length > this.filterForm.value.pageNumber &&
      !this.loading
    ) {
      this.loading = true;
      let query = this.filterForm.value;
      query.pageNumber = query.pageNumber + 1;
      if (!query.Title) {
        delete query.Title;
      }
      this.blogService
        .getBlogEntries(query)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.response = res;
            this.filterForm.patchValue({
              pageNumber: this.response.pageNumber,
              pageSize: this.response.pageSize,
              totalRecords: this.response.totalRecords,
            });
            this.data = [...this.data, ...res.data];
          },
          error: (err: any) => {
            this.data = [];
            this.loading = false;
            this.page.handleError(err);
          },
        });
    }
  }
}
