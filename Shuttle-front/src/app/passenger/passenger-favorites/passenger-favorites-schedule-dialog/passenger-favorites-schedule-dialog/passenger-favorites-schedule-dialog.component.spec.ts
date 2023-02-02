import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerFavoritesScheduleDialogComponent } from './passenger-favorites-schedule-dialog.component';

describe('PassengerFavoritesScheduleDialogComponent', () => {
  let component: PassengerFavoritesScheduleDialogComponent;
  let fixture: ComponentFixture<PassengerFavoritesScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerFavoritesScheduleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerFavoritesScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
