import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedProductSectionComponent } from './related-product-section.component';

describe('RelatedProductSectionComponent', () => {
  let component: RelatedProductSectionComponent;
  let fixture: ComponentFixture<RelatedProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedProductSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
