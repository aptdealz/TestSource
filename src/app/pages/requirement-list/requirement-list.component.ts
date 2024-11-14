import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { CongratsPopupComponent } from 'src/app/shared/modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { SendQuotesComponent } from 'src/app/shared/modals/send-quotes/send-quotes.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { RoleService } from 'src/app/services/role.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { RequirementService } from 'src/app/services/requirement.service';
import { Requirement } from 'src/app/models/requirement.model';
import { AddressService } from 'src/app/services/address.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss'],
})
export class RequirementListComponent implements OnInit, OnDestroy {
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  private titleService = inject(Title);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private roleService = inject(RoleService);
  private categoryService = inject(CategoryService);
  private requirementService = inject(RequirementService);
  private addressService = inject(AddressService);
  private userService = inject(UserService);

  private dialog = inject(MatDialog);
  isBuyer = this.roleService.isBuyer();
  isSeller = this.roleService.isSeller();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Requirement', path: '' },
  ];
  list: Requirement[] = [];
  categories: any = [];
  cities: string[] = [];
  loading: boolean = true;
  pageTitle: string = 'Requirement List';
  categoryList: Category[] = [];
  filterData: any;
  filterForm: any;
  private ngUnsubscribe$ = new Subject<void>();
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      Category: [null],
      City: [null],
    });
    this.titleService.setTitle(this.pageTitle);
    this.getData();
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.categoryList = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.addressService
      .getAllCities()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.cities = res;
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
  openQuote(requirement: any) {
    // this.modalService.dismissAll();
    if (this.isBuyer) {
      let message =
        'You are currently logged in as buyer. If you want to submit quote please login as a seller';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'congrats-dialog';
        dialogConfig.data = {text: message, title: title};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(CongratsPopupComponent, {
          ...dialogConfig
        });

        dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_seller') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.data = {isSeller: 'seller'};
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          this.router.navigateByUrl('/become-vendor');
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'quote-dialog-lg';
      dialogConfig.data = {requirementId: requirement.requirementId,
        pickupProductDirectly: requirement.pickupProductDirectly,
        needInsuranceCoverage: requirement.needInsuranceCoverage,
        quantity: requirement.quantity};
        dialogConfig.disableClose =true;
        const dialogRef = this.dialog.open(SendQuotesComponent, {
        ...dialogConfig
      });
    }
  }

  getData() {
    let query: any = {};
    if (this.filterForm.value.City) {
      query.City = this.filterForm.value.City;
    }
    if (this.filterForm.value.Category) {
      query.Category = this.filterForm.value.Category;
    }
    this.requirementService
      .getRequirementList(query)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.list = res?.data;
          this.filterData = this.list;
          this.loading = false;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }

  submit() {
    this.getData();
  }
  reset() {
    /* this.filterForm.patchValue({
      category: '',
    }); */
    this.filterData = [];
    this.filterForm.reset();
    this.getData();
  }
  viewMore(id:any){
   if (this.authService.isLoggedIn) {
      if (this.isBuyer) {
        this.router.navigate(['/buyer-requirement-details/',id]);
      }
      else{
      this.router.navigate(['/seller-requirement-details/',id]);
   }
   } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig,
      });
      /* dialogRef.afterClosed().subscribe((res) => {
        this.router.navigateByUrl('/seller-requirement-details/',id);
      }); */
    }
  }

  openConfirmQuote(item:any){
    this.getRequirementData(item);

  }
  getRequirementData(item:any) {
    const userId = this.userService.getUserId();
    this.requirementService
      .getRequirementById(item.requirementId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
         if (res.data.receivedQuotes.length > 0) {
          this.page.showWarningToast(`You've already submitted one quote.`)
         } else {
          if (this.authService.isLoggedIn) {
            this.openQuote(item)
           } else {
             const dialogConfig = new MatDialogConfig();
             dialogConfig.panelClass = 'login-dialog';
             dialogConfig.disableClose =true;
             const dialogRef = this.dialog.open(LoginComponent, {
               ...dialogConfig,
             });
            /*  dialogRef.afterClosed().subscribe((res) => {
               this.openQuote(item)
             }); */
           }
         }
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
}
