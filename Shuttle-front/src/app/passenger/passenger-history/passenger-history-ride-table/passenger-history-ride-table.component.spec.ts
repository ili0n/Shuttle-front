import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerHistoryRideTableComponent } from './passenger-history-ride-table.component';

describe('PassengerHistoryRideTableComponent', () => {
  let component: PassengerHistoryRideTableComponent;
  let fixture: ComponentFixture<PassengerHistoryRideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerHistoryRideTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerHistoryRideTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
