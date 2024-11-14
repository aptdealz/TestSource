import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTabSectionComponent } from './image-tab-section.component';

describe('ImageTabSectionComponent', () => {
  let component: ImageTabSectionComponent;
  let fixture: ComponentFixture<ImageTabSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTabSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageTabSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
