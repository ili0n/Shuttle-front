import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHistoryRideDetailsComponent } from './driver-history-ride-details.component';

describe('DriverHistoryRideDetailsComponent', () => {
  let component: DriverHistoryRideDetailsComponent;
  let fixture: ComponentFixture<DriverHistoryRideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverHistoryRideDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverHistoryRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
