import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';
import { DriverHistoryRideDetailsComponent } from './driver-history-ride-details/driver-history-ride-details.component';
import { DriverHistoryRidePassengersComponent } from './driver-history-ride-passengers/driver-history-ride-passengers.component';
import { DriverHistoryRideTableComponent } from './driver-history-ride-table/driver-history-ride-table.component';

import { DriverHistoryComponent } from './driver-history.component';

describe('DriverHistoryComponent', () => {
  let component: DriverHistoryComponent;
  let fixture: ComponentFixture<DriverHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
            DriverHistoryComponent,
            // You'd mock these.
            DriverHistoryRideDetailsComponent,
            DriverHistoryRidePassengersComponent,
            DriverHistoryRideTableComponent
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

    fixture = TestBed.createComponent(DriverHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
