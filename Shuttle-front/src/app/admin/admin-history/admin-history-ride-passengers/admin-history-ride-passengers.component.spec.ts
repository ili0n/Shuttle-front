import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';

import { AdminHistoryRidePassengersComponent } from './admin-history-ride-passengers.component';

describe('AdminHistoryRidePassengersComponent', () => {
  let component: AdminHistoryRidePassengersComponent;
  let fixture: ComponentFixture<AdminHistoryRidePassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryRidePassengersComponent ],
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

    fixture = TestBed.createComponent(AdminHistoryRidePassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
