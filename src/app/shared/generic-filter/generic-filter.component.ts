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
  selector: 'app-generic-filter',
  templateUrl: './generic-filter.component.html',
  styleUrls: ['./generic-filter.component.scss'],
})
export class GenericFilterComponent implements OnInit, OnDestroy {
  @Input('categoryTree') categoryTree: any;
  selectedSubCategory = '';
  @Output() clicked = new EventEmitter<void>();
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private page: PageService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res) => {
        this.selectedSubCategory = res.subcategory;
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
  selectSubCategory(category: any, subcategory: any) {
    this.clicked.emit();
    this.router.navigate(['/product', category.urlName, subcategory.urlName]);
  }
}
