import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSellerComponent } from './personal-seller.component';

describe('PersonalSellerComponent', () => {
  let component: PersonalSellerComponent;
  let fixture: ComponentFixture<PersonalSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
