import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PageService } from './page.service';
import { environment } from 'src/environments/environment';
import { CartItem, AddCartItemRequest } from '../models/cart.model';
import { ResponseModel } from '../models/generic/response.model';
@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private page = inject(PageService);

  basePath = environment.baseApiUrl;

  private ngUnsubscribe$ = new Subject<void>();
  initialCart: any = null;
  cart: any;
  updateCartSubjectForDebouncing = new Subject();
  constructor(public httpClient: HttpClient) {
    this.updateCartSubjectForDebouncing.subscribe({
      next: (value: any) => {
        this.updateItemstoCart()
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.syncCart();
            },
            error: (err: any) => {
              this.page.handleError(err);
            },
          });
      },
    });
  }
  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  updateItemstoCart() {
    const url = `${this.basePath}/v1/Cart/UpdateAll`;
    const data = { Items: this.cart };
    return this.http.put(url, data);
  }

  deleteItemFromMyCart(id: string) {
    const url = `${this.basePath}/v1/Cart/Delete/${id}`;
    return this.http.delete<ResponseModel<string>>(url);
  }

  syncCart(): void {
    const url = `${this.basePath}/v1/Cart/GetAllMyCarts`;
    this.http
      .get<ResponseModel<CartItem[]>>(url)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.cart = res.data;
          this.cart.forEach((item: any) => {
            if (item.expectedDeliveryDate) {
              item.expectedDeliveryDate =
                item.expectedDeliveryDate.split('T')[0];
            }
            if (
              new Date(item.expectedDeliveryDate) <
              new Date(new Date().toISOString().split('T')[0])
            ) {
              item.expectedDeliveryDate = '';
            }
          });
          this.initialCart = this.cart.map((x: any) => Object.assign({}, x));
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  async updateCart() {
    if (JSON.stringify(this.cart) != JSON.stringify(this.initialCart)) {
      // this.updateCartSubjectForDebouncing.next(this.cart)
      this.updateItemstoCart()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.initialCart = JSON.parse(JSON.stringify(this.cart));
          },
          error: (err: any) => {
            this.page.handleError(err);
          },
        });
    }
  }

  isItemInCart(id: any) {
    if (this.cart) {
      return this.cart.find((item: any) => {
        return item?.genericProduct?.genericProductId == id;
      });
    } else {
      return false;
    }
  }

  resetCart() {
    this.cart = null;
    this.initialCart = null;
  }

  addItemToCart(data: AddCartItemRequest): Observable<ResponseModel<string>> {
    let obj = {
      userId: '',
      genericProductId: data.genericProductId,
      quantity: 1,
      unit: '',
      totalPriceEstimation: 0,
      preferInIndiaProducts: false,
      pickupProductDirectly: false,
      description: '',
      deliveryLocationPinCode: '',
      preferredSourceOfSupply: '',
      expectedDeliveryDate: new Date(),
      needInsuranceCoverage: false,
      status: 1,
    };
    return this.httpClient.post<ResponseModel<string>>(
      `${this.basePath}/v1/Cart/Create`,
      obj
    );
  }
}
