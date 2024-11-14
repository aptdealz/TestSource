import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectSearchDropdownComponent } from './multi-select-search-dropdown.component';

describe('MultiSelectSearchDropdownComponent', () => {
  let component: MultiSelectSearchDropdownComponent;
  let fixture: ComponentFixture<MultiSelectSearchDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSelectSearchDropdownComponent]
    });
    fixture = TestBed.createComponent(MultiSelectSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
