import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirenmentsComponent } from './requirements.component';

describe('RequirenmentsComponent', () => {
  let component: RequirenmentsComponent;
  let fixture: ComponentFixture<RequirenmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirenmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequirenmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
