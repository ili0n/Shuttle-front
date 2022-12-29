import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerService } from './passenger.service';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';



@NgModule({
  declarations: [
    PassengerHomeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PassengerModule { }
