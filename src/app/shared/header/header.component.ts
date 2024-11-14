import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { CongratsPopupComponent } from '../modals/congrats-popup/congrats-popup.component';
import { LoginComponent } from '../modals/login/login.component';
import { SignupComponent } from '../modals/signup/signup.component';
import { Subject, takeUntil ,forkJoin } from 'rxjs';
import { UserStatus, LoggedOutStatus } from 'src/app/models/user-status.model';
import { ProductService } from 'src/app/services/product.service';
import { AddressService } from 'src/app/services/address.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { SellerProductTitle } from 'src/app/models/seller-product-title.model';
import { GenericProductTitle } from 'src/app/models/GenericProductTitle.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private authService = inject(AuthService);
  private page = inject(PageService);
  private productService = inject(ProductService);
  private addressService = inject(AddressService);
  private dialog = inject(MatDialog);
  user: UserStatus = new LoggedOutStatus();
  hideSubscriptionPlan = environment.hideSubscriptionPlan;
  rlActiveOptions = { exact: true };
  district = '';
  checkSidebar: boolean = false;
  width: any;
  searchkeyword = '';
  districts: string[] = [];
  suggestions: SellerProductTitle[] = [];
  ItemTitleSellerPdt: SellerProductTitle[] = [];
  ItemTitleGenericPdt:GenericProductTitle[] = [];
  Item:SellerProductTitle[] = [];

  isInputFocused = false;
  ngOnInit(): void {
      this.watchUserStatus();
      if(this.page.isPlatformBrowser()){
        this.width = window.innerWidth
      }
    this.getAllDistricts();
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

  getAllDistricts = () => {
    this.addressService
      .getAllDistricts()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.districts = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  };

  onSubscription() {
    if (this.user.loggedIn) {
      this.router.navigateByUrl('/my-subscription');
    } else {
      const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
      dialogRef.afterClosed().subscribe((res) => {
        this.router.navigateByUrl('/');
      });
    }
  }

  openCart() {
    if (!this.user.loggedIn) {
      this.loginModal();
    } else if (this.user.seller) {
      let message =
        'You are currently logged in as seller. If you want to submit post requirement please login as a buyer';
      let title = 'Access Denied';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'congrats-dialog';
      dialogConfig.data = {text: message,isBuyer:true, title: title};
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(CongratsPopupComponent, {
        ...dialogConfig
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res == 'login_buyer') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'login-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(LoginComponent, {
            ...dialogConfig
          });
        } else if (res == 'cross_click') {
          this.authService.logout();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'signup-dialog';
          dialogConfig.disableClose =true;
          const dialogRef = this.dialog.open(SignupComponent, {
            ...dialogConfig
          });
        }
      });
    } else {
      this.router.navigateByUrl('/cart');
    }
  }
  openSidebar() {
    this.checkSidebar = true;
  }
  changeValue(event: any) {
    this.checkSidebar = event;
  }
  loginModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(LoginComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == 1) {
         // this.page.showSuccessToast('User Logged In', '');
          if (window.location.pathname.includes('become-vendor')) {
            this.router.navigateByUrl('/');
          }
        }
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }
  signupModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'signup-dialog';
    dialogConfig.disableClose =true;
    const dialogRef = this.dialog.open(SignupComponent, {
      ...dialogConfig
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == 1) {
          this.page.showSuccessToast('Please Login');
          this.loginModal();
        }
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }
  toggleClass() {
    this.page.sidebar = !this.page.sidebar;
  }

  search(keyword?: any) {
    if (keyword) {
      this.searchkeyword = keyword;
    }
    const titleQuery = 'Title=' + (keyword ?? this.searchkeyword);
    const districtQuery = this.district ? `&District=${this.district}` : '';
   //let url = `/promoted-products?${titleQuery}${districtQuery}`;
   let url = `/product-search?${titleQuery}${districtQuery}`;
    this.suggestions = [];
    this.router.navigateByUrl(url);
  }

  SellerProductsTitle(parm:any)
  {

    
    return this.productService
    .getAllSellerProductsTitle( parm )
    .pipe(
      takeUntil(this.ngUnsubscribe$)
    );
   
  }

  GenericProductsTitle(parm:any)
  {
    
    return this.productService
    .getAllGenericProductsTitle( parm )
    .pipe(
      takeUntil(this.ngUnsubscribe$)
    );
  }


  getCombinedProducts() {
    console.log("In getCombinedProducts");
    console.log("Seller Product In getCombinedProducts"); console.log(this.ItemTitleSellerPdt);
    console.log("Generic Product In getCombinedProducts"); console.log(this.ItemTitleGenericPdt);
    this.Item=
     [
        ...this.ItemTitleSellerPdt.map(product => ({            
            title: product.title           
        })),
        ...this.ItemTitleGenericPdt.map(genericProduct => ({            
            title:genericProduct.title           
        }))
    ];



    // Use a Map to combine products based on title and categoryId
    const combinedMap = new Map();

    this.Item.forEach(product => {
        const key = `${product.title}`;

        if (combinedMap.has(key)) {
            // If the product with the same title and categoryId already exists
            const existingProduct = combinedMap.get(key);
            // Merge sellerProductId and genericProductId (populate only if missing)
            existingProduct.sellerProductId = existingProduct.title || product.title;
            
        } else {
            // If no existing product, just add it to the map
            combinedMap.set(key, { ...product });
        }
    });

    // Convert the map back to an array
    this.Item = Array.from(combinedMap.values());


    console.log("The combinedProducts is:", JSON.stringify(this.Item, null, 2));
}


  showSuggestions(event: any) {
    
    let val= event.target.value;
    let strVal=String(val) ;
    console.log (   "strVal="  );
    console.log(strVal);
     
    let query={
      title:strVal
    }

  /*  if (event.target.value) {
      this.productService
        .getAllSellerProductsTitle({ Title: event.target.value })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            if (res.data) {
              this.suggestions = res.data.map((item: any) => {
                return item.title;
              });
            } else {
              this.suggestions = [];
            }
          },
          error: (err: any) => {
            this.suggestions = [];
            this.page.handleError(err);
          },
        });
    }
   */


    if (event.target.value) {

    forkJoin({
      sellerProducts: this.SellerProductsTitle( query ),
      genericProducts: this.GenericProductsTitle( query)
    }).subscribe({
      next: (results) => {
        
        this.ItemTitleSellerPdt = results.sellerProducts.data;
        this.ItemTitleGenericPdt = results.genericProducts.data;

        // Combine the two lists into one
        this.getCombinedProducts();

        console.log("Seller Products:", this.ItemTitleSellerPdt);
        console.log("Generic Products:", this.ItemTitleGenericPdt);
        console.log("Combined Products:", this.Item);


        if (this.Item.length>0) {
          this.suggestions = Object.values(this.Item);         
          return Object.values(this.Item);
        }
        else
        {
          this.suggestions = [];
          return Object.values(this.Item);
        }

        console.log("suggestions=");
        console.log(this.suggestions);
        
      },
      error: (err) => {
        this.suggestions = [];
        this.page.handleError(err);
      }
    });

  }



  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused = false;
    }, 250);
  }

  get hasSuggestions(): boolean {
    return (
      this.suggestions.length > 0 &&
      this.searchkeyword.length > 0 &&
      this.isInputFocused 
     
    );
  }


  selectSuggestion(item: string) {
    this.searchkeyword = item;  // Set the search keyword to the selected suggestion
    this.suggestions=[];
    this.search(this.searchkeyword );
  }

}
