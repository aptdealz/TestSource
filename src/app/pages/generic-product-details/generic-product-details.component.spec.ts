import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericProductDetailsComponent } from './generic-product-details.component';

describe('ProductDetailsComponent', () => {
  let component: GenericProductDetailsComponent;
  let fixture: ComponentFixture<GenericProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericProductDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
