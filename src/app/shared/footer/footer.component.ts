import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../modals/login/login.component';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { UserStatus, LoggedOutStatus } from 'src/app/models/user-status.model';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  user: UserStatus = new LoggedOutStatus();

  list: Category[] = [];
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.watchUserStatus();
    this.getTopCategories();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  watchUserStatus = () => {
    this.authService
      .userStatus()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response) => (this.user = { ...response }),
        error: () => (this.user = new LoggedOutStatus()),
      });
  };

  getTopCategories = () => {
    this.categoryService
      .getTopCategories()
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

  open() {
    if (this.user.loggedIn) {
      this.router.navigateByUrl('/buyer-profile/order-history');
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig,
      });
    }
  }
}
