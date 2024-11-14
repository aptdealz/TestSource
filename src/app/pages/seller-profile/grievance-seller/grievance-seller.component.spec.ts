import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceSellerComponent } from './grievance-seller.component';

describe('GrievanceSellerComponent', () => {
  let component: GrievanceSellerComponent;
  let fixture: ComponentFixture<GrievanceSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
