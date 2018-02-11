import { TestBed, inject } from '@angular/core/testing';

import { LandingScrollService } from './landing-scroll.service';

describe('LandingScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingScrollService]
    });
  });

  it('should be created', inject([LandingScrollService], (service: LandingScrollService) => {
    expect(service).toBeTruthy();
  }));
});
