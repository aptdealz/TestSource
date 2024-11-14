import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from '../modals/login/login.component';
import { SignupComponent } from '../modals/signup/signup.component';
import { LoggedOutStatus, UserStatus } from 'src/app/models/user-status.model';
import { CategoryService } from 'src/app/services/category.service';
import { Category, CategoryTree } from 'src/app/models/category.model';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrls: ['./sidebar-mobile.component.scss'],
})
export class SidebarMobileComponent implements OnInit, OnDestroy {
  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private router = inject(Router);
  private authService = inject(AuthService);
  public page = inject(PageService);
  private categoryService = inject(CategoryService);
  private subcategoryService = inject(SubcategoryService);
  private dialog = inject(MatDialog);
  user: UserStatus = new LoggedOutStatus();
  hideSubscriptionPlan = environment.hideSubscriptionPlan;

  hasSidebar = this.page.sidebar;

  list: Category[] = [];
  check: boolean = true;
  categoryTree: CategoryTree[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  panelOpenState = false;
  ngOnInit(): void {
    this.watchUserStatus();
    this.setSidebarStyle();
    this.getCategories();
    this.getSubCategoryTree();
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
        next: (response: UserStatus) => (this.user = { ...response }),
        error: () => (this.user = new LoggedOutStatus()),
      });
  };

  setSidebarStyle = () => {
    setTimeout(() => {
      const sidebar = this.elRef.nativeElement.querySelector('.show');
      this.renderer.setStyle(sidebar, 'transition', '.5s');
    }, 1000);
  };

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

  getSubCategoryTree = () => {
    this.subcategoryService
      .getSubCategoryTree()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.categoryTree = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  };

  gotoProducts(category: any, subcategory: any) {
    this.page.sidebar = !this.page.sidebar;
    this.router.navigate(['/product', category.urlName, subcategory.urlName]);
  }

  toggle() {
    this.page.sidebar = !this.page.sidebar;
  }

  loginModal() {
    this.page.sidebar = !this.page.sidebar;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {name: 'world'};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
  }

  signupModal() {
    this.page.sidebar = !this.page.sidebar;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'signup-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SignupComponent, {
      ...dialogConfig
    });
  }

  openConfirm(text: any) {
    this.page.sidebar = !this.page.sidebar;
    let message: any;
    switch (text) {
      case 'logout':
        message = 'Do you want to logout?';
        break;
      case 'deactivate':
        message = 'Do you want to Deactivate account?';
        break;
      case 'switch':
        message = 'Do you want to login in with buyer account?';
        break;
      default:
        break;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'confirm-dialog';
    dialogConfig.data = {text: message};
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe(
      (reason) => {
        if (reason == 'yes') {
          if (text == 'deactivate' || text == 'logout') {
            this.authService.logout();
            this.page.showSuccessToast('Logged out.');
            this.router.navigateByUrl('/');
          } else {
            this.authService.logout();
            this.router.navigateByUrl('/');
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'login-dialog';
            dialogConfig.disableClose =true;
            const dialogRef = this.dialog.open(LoginComponent, {
              ...dialogConfig
            });
          }
        }
      }
    );
  }
}
