import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEnquiriesComponent } from './sellerEnquiries.component';

describe('SellerEnquiriesComponent', () => {
  let component: SellerEnquiriesComponent;
  let fixture: ComponentFixture<SellerEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerEnquiriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
