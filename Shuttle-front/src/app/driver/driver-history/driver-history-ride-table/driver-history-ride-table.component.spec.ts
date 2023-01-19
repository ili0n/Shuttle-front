import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHistoryRideTableComponent } from './driver-history-ride-table.component';

describe('DriverHistoryRideTableComponent', () => {
  let component: DriverHistoryRideTableComponent;
  let fixture: ComponentFixture<DriverHistoryRideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverHistoryRideTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverHistoryRideTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
