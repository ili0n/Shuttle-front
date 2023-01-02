import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerPanicDialogComponent } from './passenger-panic-dialog.component';

describe('PassengerPanicDialogComponent', () => {
  let component: PassengerPanicDialogComponent;
  let fixture: ComponentFixture<PassengerPanicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerPanicDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerPanicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
