import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();
  @Input('categoryTree') categoryTree: any;
  selectedSubCategory = '';
  @Output() clicked = new EventEmitter<void>();
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private page: PageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res) => {
        this.selectedSubCategory = res.subCategoryId;
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
  selectSubCategory(subcategory: any) {
    this.clicked.emit();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { subCategoryId: subcategory.subCategoryId }
    });
  }
}
