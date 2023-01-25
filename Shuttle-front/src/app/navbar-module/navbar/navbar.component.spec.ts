import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { DriverNavbarComponent } from '../driver-navbar/driver-navbar.component';
import { PassengerNavbarComponent } from '../passenger-navbar/passenger-navbar.component';
import { UnregisteredNavbarComponent } from '../unregistered-navbar/unregistered-navbar.component';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        NavbarComponent,
        // You'd mock these
        AdminNavbarComponent,
        PassengerNavbarComponent,
        DriverNavbarComponent,
        UnregisteredNavbarComponent,
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
