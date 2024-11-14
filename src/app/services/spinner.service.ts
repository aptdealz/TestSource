import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  constructor() {}

  show() {
    this.spinning.next(true);
  }

  hide() {
    this.spinning.next(false);
  }
}
