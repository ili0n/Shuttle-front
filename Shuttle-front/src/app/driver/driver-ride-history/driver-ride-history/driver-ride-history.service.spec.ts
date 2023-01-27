import { TestBed } from '@angular/core/testing';

import { DriverRideHistoryService } from './driver-ride-history.service';

describe('DriverRideHistoryService', () => {
  let service: DriverRideHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverRideHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
