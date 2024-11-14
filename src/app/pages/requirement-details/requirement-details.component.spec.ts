import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDetailsComponent } from './requirement-details.component';

describe('RequirementDetailsComponent', () => {
  let component: RequirementDetailsComponent;
  let fixture: ComponentFixture<RequirementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
