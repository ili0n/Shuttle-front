import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerFavoriteNameDialogComponent } from './passenger-favorite-name-dialog.component';

describe('PassengerFavoriteNameDialogComponent', () => {
  let component: PassengerFavoriteNameDialogComponent;
  let fixture: ComponentFixture<PassengerFavoriteNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerFavoriteNameDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerFavoriteNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
