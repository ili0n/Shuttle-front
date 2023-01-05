import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidePanicDialogComponent } from './ride-panic-dialog.component';

describe('RidePanicDialogComponent', () => {
  let component: RidePanicDialogComponent;
  let fixture: ComponentFixture<RidePanicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RidePanicDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidePanicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
