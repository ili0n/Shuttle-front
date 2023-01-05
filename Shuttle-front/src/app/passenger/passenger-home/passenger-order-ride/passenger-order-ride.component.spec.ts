import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerOrderRideComponent } from './passenger-order-ride.component';

describe('PassengerOrderRideComponent', () => {
  let component: PassengerOrderRideComponent;
  let fixture: ComponentFixture<PassengerOrderRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerOrderRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerOrderRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
