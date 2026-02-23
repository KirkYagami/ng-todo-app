import { TestBed } from '@angular/core/testing';

import { DynamicLoader } from './dynamic-loader';

describe('DynamicLoader', () => {
  let service: DynamicLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
