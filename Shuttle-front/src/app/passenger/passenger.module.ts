import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { PassengerService } from './passenger.service';
import { PassengerOrderRideComponent } from './passenger-home/passenger-order-ride/passenger-order-ride.component';
import { PassengerCurrentRideComponent } from './passenger-home/passenger-current-ride/passenger-current-ride.component';
import { PassengerHistoryComponent } from './passenger-history/passenger-history.component';

@NgModule({
  declarations: [
    PassengerHomeComponent,
    PassengerOrderRideComponent,
    PassengerCurrentRideComponent,
    PassengerHistoryComponent,
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
