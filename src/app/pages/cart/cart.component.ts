import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { PageService } from 'src/app/services/page.service';
import { units } from 'src/app/helpers/generic.helper.';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { MatDialog } from '@angular/material/dialog';
import { BuyerService } from 'src/app/services/buyer.service';
import { BuyerResponse } from 'src/app/models/buyer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  today = new Date().toISOString().slice(0, 10);
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shopping Cart', path: '/cart' },
    { title: 'Checkout', path: '' },
    { title: 'Order Complete', path: '' },
  ];
  pageTitle: string = 'Quotesouk';
  units = units;
  profileData!: BuyerResponse;
  isPickup: boolean = false;
  isReseller: boolean = false;
  agreeGSTc: boolean = false;
  gstin: string = '';
  interval: any = null;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private titleService: Title,
    public buyerService: BuyerService,
    public cartService: CartService,
    public page: PageService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {

    this.buyerService
    .getBuyerProfile()
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res: any) => {
        this.profileData = res.data;
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });

    this.titleService.setTitle(this.pageTitle);
    this.cartService.syncCart();
    interval(1000)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((x) => {
        this.cartService.updateCart();
      });
  }
  close() {
    this.dismissModal();
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  billModal() {
    this.cartService.cart.agreeGSTc = this.agreeGSTc;
    this.cartService.cart.isReseller = this.isReseller;
    if(this.cartService.cart.isReseller){
      this.cartService.cart.gstin = this.gstin;
    }
    this.dismissModal();
    this.router.navigateByUrl('/checkout');
  }
  remove(id: any) {
    this.cartService
      .deleteItemFromMyCart(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.page.showSuccessToast('Item Removed Successfully');
          this.cartService.syncCart();
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }

  onQuantityDecrement(i: any) {
    let value = this.cartService.cart[i].quantity - 1;
    if (value > 0) {
      this.cartService.cart[i].quantity = value;
    }
  }

  onQuantityIncrement(i: any) {
    this.cartService.cart[i].quantity = this.cartService.cart[i].quantity + 1;
  }

  get totalCartValue(): number {
    let total = 0;
    this.cartService.cart?.forEach((item: any) => {
      total += item.totalPriceEstimation * item.quantity;
    });
    return total;
  }
  get checkRequired() {
    if (this.cartService.cart) {
      for (let index = 0; index < this.cartService.cart.length; index++) {
        if (
          this.cartService.cart[index].deliveryLocationPinCode &&
          this.cartService.cart[index].description &&
          this.cartService.cart[index].preferredSourceOfSupply &&
          this.cartService.cart[index].unit &&
          this.cartService.cart[index].quantity &&
          this.cartService.cart[index].expectedDeliveryDate &&
          this.cartService.cart[index].totalPriceEstimation
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }
  dismissModal() {
    this.dialog.closeAll();
  }
  checkReseller(event: any) {
    if (event.target.checked) {
      if (this.profileData.gstin) {
        this.gstin = this.profileData.gstin;
        // this.requirementForm.patchValue({
        //   gstin: this.profileData.gstin,
        // });
      }
    }
    this.isReseller = !this.isReseller;
  }
  checkPickup(event: any) {
    this.isPickup = !this.isPickup;
  }
  allowOnlyNumbers(event: any) {
    if (!(event.code.toLowerCase() == 'delete' || event.code.toLowerCase() == 'backspace' || event.code.toLowerCase() == 'tab') && event.target.value.length >= 6) {
      event.preventDefault();
      return;
    }
    const keyCode = event.keyCode || event.which;

    // Keycodes for number keys (0-9) from the main keyboard (48-57)
    const isMainKeyboardNumber = keyCode >= 48 && keyCode <= 57;

    // Keycodes for number pad keys (0-9) (96-105)
    const isNumberPadKey = keyCode >= 96 && keyCode <= 105;

    // Allow backspace, delete, tab, arrow keys (keycodes 8, 46, 9, 37-40)
    const isControlKey = keyCode === 8 || keyCode === 46 || keyCode === 9 ||
                        (keyCode >= 37 && keyCode <= 40);

    if (!isMainKeyboardNumber && !isNumberPadKey && !isControlKey) {
      event.preventDefault();  // Prevent any other key input
    }
   }
  //dismissModal = (message: string) => this.activeModal.dismiss(message);
}
