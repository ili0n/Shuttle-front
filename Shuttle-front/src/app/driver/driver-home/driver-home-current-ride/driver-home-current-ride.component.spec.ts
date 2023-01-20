import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHomeCurrentRideComponent } from './driver-home-current-ride.component';

describe('DriverHomeCurrentRideComponent', () => {
  let component: DriverHomeCurrentRideComponent;
  let fixture: ComponentFixture<DriverHomeCurrentRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverHomeCurrentRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverHomeCurrentRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
