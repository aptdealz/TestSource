import { TestBed } from '@angular/core/testing';

import { StaticPagesService } from './static-pages.service';

describe('StaticPagesService', () => {
  let service: StaticPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
