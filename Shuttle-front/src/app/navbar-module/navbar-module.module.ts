import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { DriverNavbarComponent } from './driver-navbar/driver-navbar.component';
import { PassengerNavbarComponent } from './passenger-navbar/passenger-navbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { UnregisteredNavbarComponent } from './unregistered-navbar/unregistered-navbar.component';
import { MatSliderModule } from '@angular/material/slider';



@NgModule({
  declarations: [
    AdminNavbarComponent,
    UnregisteredNavbarComponent,
    DriverNavbarComponent,
    PassengerNavbarComponent,
    NavbarComponent
  ],
  exports: [
    AdminNavbarComponent,
    UnregisteredNavbarComponent,
    DriverNavbarComponent,
    PassengerNavbarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSliderModule,
  ]
})
export class NavbarModuleModule { }
