import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOrderDetailsComponent } from './buyer-order-details.component';

describe('BuyerOrderDetailsComponent', () => {
  let component: BuyerOrderDetailsComponent;
  let fixture: ComponentFixture<BuyerOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerOrderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
