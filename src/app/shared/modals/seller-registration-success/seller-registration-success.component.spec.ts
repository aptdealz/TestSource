import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRegistrationSuccessComponent } from './seller-registration-success.component';

describe('SellerRegistrationSuccessComponent', () => {
  let component: SellerRegistrationSuccessComponent;
  let fixture: ComponentFixture<SellerRegistrationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerRegistrationSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerRegistrationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
