import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';

import { DriverProfileComponent } from './driver-profile.component';

describe('DriverProfileComponent', () => {
  let component: DriverProfileComponent;
  let fixture: ComponentFixture<DriverProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverProfileComponent ],
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

    fixture = TestBed.createComponent(DriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
