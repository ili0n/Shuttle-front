import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryRideTableComponent } from './admin-history-ride-table.component';

describe('AdminHistoryRideTableComponent', () => {
  let component: AdminHistoryRideTableComponent;
  let fixture: ComponentFixture<AdminHistoryRideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryRideTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryRideTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
