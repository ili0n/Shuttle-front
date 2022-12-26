import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import {UnregisteredNavbarComponent} from "./unregistered-navbar/unregistered-navbar.component";
import { DriverNavbarComponent } from './driver-navbar/driver-navbar.component';
import { PassengerNavbarComponent } from './passenger-navbar/passenger-navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/infrastructure/material.module';



@NgModule({
  declarations: [
    AdminNavbarComponent,
    UnregisteredNavbarComponent,
    DriverNavbarComponent,
    PassengerNavbarComponent,
    NavbarComponent
  ],
  exports: [
    DriverNavbarComponent,
    AdminNavbarComponent,
    PassengerNavbarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MaterialModule
  ]
})
export class NavbarModuleModule { }
