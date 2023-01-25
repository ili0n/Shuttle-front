import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHistoryRideTableComponent } from './driver-history-ride-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/infrastructure/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DriverHistoryRideTableComponent', () => {
  let component: DriverHistoryRideTableComponent;
  let fixture: ComponentFixture<DriverHistoryRideTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverHistoryRideTableComponent ],
      imports: [ HttpClientTestingModule, MaterialModule, BrowserAnimationsModule ]
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
