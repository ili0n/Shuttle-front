import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationMapComponent } from './estimation-map.component';

describe('EstimationMapComponent', () => {
  let component: EstimationMapComponent;
  let fixture: ComponentFixture<EstimationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
