import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquirySectionComponent } from './enquiry-section.component';

describe('EnquirySectionComponent', () => {
  let component: EnquirySectionComponent;
  let fixture: ComponentFixture<EnquirySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquirySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquirySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
