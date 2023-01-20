import { TestBed } from '@angular/core/testing';

import { DriverSocketService } from './driver-socket.service';

describe('DriverSocketService', () => {
  let service: DriverSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
