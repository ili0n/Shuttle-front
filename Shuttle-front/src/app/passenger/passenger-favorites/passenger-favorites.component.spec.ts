import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerFavoritesComponent } from './passenger-favorites.component';

describe('PassengerFavoritesComponent', () => {
  let component: PassengerFavoritesComponent;
  let fixture: ComponentFixture<PassengerFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerFavoritesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
