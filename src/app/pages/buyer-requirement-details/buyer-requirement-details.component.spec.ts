import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerRequirementDetailsComponent } from './buyer-requirement-details.component';

describe('BuyerRequirementDetailsComponent', () => {
  let component: BuyerRequirementDetailsComponent;
  let fixture: ComponentFixture<BuyerRequirementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerRequirementDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerRequirementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
