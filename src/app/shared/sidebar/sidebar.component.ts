import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Seller } from 'src/app/models/seller.model';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() checkSidebar: any;
  @Output() newItemEvent = new EventEmitter<string>();
  list: Category[] = [];
  listVendor: Seller[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    public page: PageService,
    public categoryService: CategoryService,
    public partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getTopSellers();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getCategories = () => {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  };

  getTopSellers = () => {
    this.partnerService
      .getAllTopSellers()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.listVendor = res.data;
        },
        error: (err: any) => {
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  };

  close() {
    this.checkSidebar = false;
    this.newItemEvent.emit(this.checkSidebar);
  }
}
