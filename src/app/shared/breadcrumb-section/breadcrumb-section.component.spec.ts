import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbSectionComponent } from './breadcrumb-section.component';

describe('BreadcrumbSectionComponent', () => {
  let component: BreadcrumbSectionComponent;
  let fixture: ComponentFixture<BreadcrumbSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadcrumbSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
