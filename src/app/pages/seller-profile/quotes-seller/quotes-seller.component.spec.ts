import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesSellerComponent } from './quotes-seller.component';

describe('QuotesSellerComponent', () => {
  let component: QuotesSellerComponent;
  let fixture: ComponentFixture<QuotesSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotesSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
