import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { PassengerService } from './passenger.service';

@NgModule({
  declarations: [
    PassengerHomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PassengerHomeComponent,
  ]
})
export class PassengerModule { }
