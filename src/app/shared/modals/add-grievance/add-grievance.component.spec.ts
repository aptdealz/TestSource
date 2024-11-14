import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrievanceComponent } from './add-grievance.component';

describe('AddGrievanceComponent', () => {
  let component: AddGrievanceComponent;
  let fixture: ComponentFixture<AddGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrievanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
