import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRateDialogComponent } from './ride-rate-dialog.component';

describe('RideRateDialogComponent', () => {
  let component: RideRateDialogComponent;
  let fixture: ComponentFixture<RideRateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideRateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
