import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerHistoryRideDetailsComponent } from './passenger-history-ride-details.component';

describe('PassengerHistoryRideDetailsComponent', () => {
  let component: PassengerHistoryRideDetailsComponent;
  let fixture: ComponentFixture<PassengerHistoryRideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerHistoryRideDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerHistoryRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
