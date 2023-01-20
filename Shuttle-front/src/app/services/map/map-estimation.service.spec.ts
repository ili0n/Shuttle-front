import { TestBed } from '@angular/core/testing';

import { MapEstimationService } from './map-estimation.service';

describe('MapEstimationService', () => {
  let service: MapEstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapEstimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
