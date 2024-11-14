import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCongratsComponent } from './checkout-congrats.component';

describe('CheckoutCongratsComponent', () => {
  let component: CheckoutCongratsComponent;
  let fixture: ComponentFixture<CheckoutCongratsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutCongratsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutCongratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
