import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerGraphComponent } from './passenger-graph.component';

describe('PassengerGraphComponent', () => {
  let component: PassengerGraphComponent;
  let fixture: ComponentFixture<PassengerGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
