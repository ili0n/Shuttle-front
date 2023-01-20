import { TestBed } from '@angular/core/testing';

import { PassengerSocketService } from './passenger-socket.service';

describe('PassengerSocketService', () => {
  let service: PassengerSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassengerSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
