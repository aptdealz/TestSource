import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInputErrorComponent } from './print-input-error.component';

describe('PrintInputErrorComponent', () => {
  let component: PrintInputErrorComponent;
  let fixture: ComponentFixture<PrintInputErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInputErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintInputErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
