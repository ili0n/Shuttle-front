import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryUserTableComponent } from './admin-history-user-table.component';

describe('AdminHistoryUserTableComponent', () => {
  let component: AdminHistoryUserTableComponent;
  let fixture: ComponentFixture<AdminHistoryUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryUserTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
