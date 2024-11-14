import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingConfirmComponent } from './billing-confirm.component';

describe('BillingConfirmComponent', () => {
  let component: BillingConfirmComponent;
  let fixture: ComponentFixture<BillingConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
