import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { PassengerService } from './passenger.service';
import { PassengerOrderRideComponent } from './passenger-home/passenger-order-ride/passenger-order-ride/passenger-order-ride.component';
import { PassengerCurrentRideComponent } from './passenger-home/passenger-current-ride/passenger-current-ride/passenger-current-ride.component';
import { PassengerPanicDialogComponent } from './passenger-home/passenger-panic-dialog/passenger-panic-dialog/passenger-panic-dialog.component';

@NgModule({
  declarations: [
    PassengerHomeComponent,
    PassengerOrderRideComponent,
    PassengerCurrentRideComponent,
    PassengerPanicDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PassengerHomeComponent,
    PassengerOrderRideComponent,
  ]
})
export class PassengerModule { }
