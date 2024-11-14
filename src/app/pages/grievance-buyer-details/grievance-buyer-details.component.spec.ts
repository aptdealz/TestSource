import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceBuyerDetailsComponent } from './grievance-buyer-details.component';

describe('GrievanceBuyerDetailsComponent', () => {
  let component: GrievanceBuyerDetailsComponent;
  let fixture: ComponentFixture<GrievanceBuyerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceBuyerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceBuyerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
