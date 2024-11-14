import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericProductsComponent } from './generic-products.component';

describe('GenericProductsComponent', () => {
  let component: GenericProductsComponent;
  let fixture: ComponentFixture<GenericProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
