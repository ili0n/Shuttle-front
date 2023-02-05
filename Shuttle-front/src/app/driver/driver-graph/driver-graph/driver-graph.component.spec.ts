import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverGraphComponent } from './driver-graph.component';

describe('DriverGraphComponent', () => {
  let component: DriverGraphComponent;
  let fixture: ComponentFixture<DriverGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
