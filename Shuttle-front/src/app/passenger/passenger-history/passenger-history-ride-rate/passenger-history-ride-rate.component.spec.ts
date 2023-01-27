import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerHistoryRideRateComponent } from './passenger-history-ride-rate.component';

describe('PassengerHistoryRideRateComponent', () => {
  let component: PassengerHistoryRideRateComponent;
  let fixture: ComponentFixture<PassengerHistoryRideRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerHistoryRideRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerHistoryRideRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
