import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSectionComponent } from './vendor-section.component';

describe('VendorSectionComponent', () => {
  let component: VendorSectionComponent;
  let fixture: ComponentFixture<VendorSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
