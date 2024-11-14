import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratsPopupComponent } from './congrats-popup.component';

describe('CongratsPopupComponent', () => {
  let component: CongratsPopupComponent;
  let fixture: ComponentFixture<CongratsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongratsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongratsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
