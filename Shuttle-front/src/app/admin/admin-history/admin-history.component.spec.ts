import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminHistoryRideDetailsComponent } from './admin-history-ride-details/admin-history-ride-details.component';
import { AdminHistoryRidePassengersComponent } from './admin-history-ride-passengers/admin-history-ride-passengers.component';
import { AdminHistoryRideTableComponent } from './admin-history-ride-table/admin-history-ride-table.component';
import { AdminHistoryUserTableComponent } from './admin-history-user-table/admin-history-user-table.component';

import { AdminHistoryComponent } from './admin-history.component';

describe('AdminHistoryComponent', () => {
  let component: AdminHistoryComponent;
  let fixture: ComponentFixture<AdminHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        AdminHistoryComponent, 
        // You'd mock these.
        AdminHistoryUserTableComponent,
        AdminHistoryRideDetailsComponent,
        AdminHistoryRidePassengersComponent,
        AdminHistoryUserTableComponent,
        AdminHistoryRideTableComponent,
    ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
