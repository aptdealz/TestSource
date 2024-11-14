import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSellerComponent } from './requirement-seller.component';

describe('RequirementSellerComponent', () => {
  let component: RequirementSellerComponent;
  let fixture: ComponentFixture<RequirementSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirementSellerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequirementSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
