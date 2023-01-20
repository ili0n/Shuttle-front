import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryRideDetailsComponent } from './admin-history-ride-details.component';

describe('AdminHistoryRideDetailsComponent', () => {
  let component: AdminHistoryRideDetailsComponent;
  let fixture: ComponentFixture<AdminHistoryRideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryRideDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
