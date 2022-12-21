import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectRideDialogComponent } from './reject-ride-dialog.component';

describe('RejectRideDialogComponent', () => {
  let component: RejectRideDialogComponent;
  let fixture: ComponentFixture<RejectRideDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectRideDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectRideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
