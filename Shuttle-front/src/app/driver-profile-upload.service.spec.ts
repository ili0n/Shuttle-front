import { TestBed } from '@angular/core/testing';

import { DriverProfileUploadService } from './driver-profile-upload.service';

describe('DriverProfileUploadService', () => {
  let service: DriverProfileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverProfileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
