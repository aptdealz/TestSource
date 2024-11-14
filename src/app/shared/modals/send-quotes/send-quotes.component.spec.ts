import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendQuotesComponent } from './send-quotes.component';

describe('SendQuotesComponent', () => {
  let component: SendQuotesComponent;
  let fixture: ComponentFixture<SendQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendQuotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
