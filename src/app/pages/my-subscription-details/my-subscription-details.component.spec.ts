import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubscriptionDetailsComponent } from './my-subscription-details.component';

describe('MySubscriptionDetailsComponent', () => {
  let component: MySubscriptionDetailsComponent;
  let fixture: ComponentFixture<MySubscriptionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySubscriptionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
