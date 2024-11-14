import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerRequirementDetailsComponent } from './seller-requirement-details.component';

describe('SellerRequirementDetailsComponent', () => {
  let component: SellerRequirementDetailsComponent;
  let fixture: ComponentFixture<SellerRequirementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerRequirementDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerRequirementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
