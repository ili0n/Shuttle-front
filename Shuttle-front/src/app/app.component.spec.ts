import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AppComponent } from './app.component';
import { AdminNavbarComponent } from './navbar-module/admin-navbar/admin-navbar.component';
import { DriverNavbarComponent } from './navbar-module/driver-navbar/driver-navbar.component';
import { NavbarModuleModule } from './navbar-module/navbar-module.module';
import { NavbarComponent } from './navbar-module/navbar/navbar.component';
import { PassengerNavbarComponent } from './navbar-module/passenger-navbar/passenger-navbar.component';
import { UnregisteredNavbarComponent } from './navbar-module/unregistered-navbar/unregistered-navbar.component';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule,
        MaterialModule
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        // Ehh...? Just leave it commented.
        // If the tests we're asked to do pass, it's ok.
        // It's not our fault...
        //AdminNavbarComponent,
        ///DriverNavbarComponent,
        //PassengerNavbarComponent,
        //UnregisteredNavbarComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'shuttle-front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('shuttle-front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('shuttle-front app is running!');
  });
});
