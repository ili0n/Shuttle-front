import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryRidePassengersComponent } from './admin-history-ride-passengers.component';

describe('AdminHistoryRidePassengersComponent', () => {
  let component: AdminHistoryRidePassengersComponent;
  let fixture: ComponentFixture<AdminHistoryRidePassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryRidePassengersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryRidePassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
