import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { PassengerService } from './passenger.service';
import { PassengerOrderRideComponent } from './passenger-home/passenger-order-ride/passenger-order-ride.component';
import { PassengerCurrentRideComponent } from './passenger-home/passenger-current-ride/passenger-current-ride.component';
import { PassengerHistoryComponent } from './passenger-history/passenger-history.component';
import { PassengerHistoryRideTableComponent } from './passenger-history/passenger-history-ride-table/passenger-history-ride-table.component';
import { PassengerHistoryRideDetailsComponent } from './passenger-history/passenger-history-ride-details/passenger-history-ride-details.component';
import { PassengerHistoryRideRateComponent } from './passenger-history/passenger-history-ride-rate/passenger-history-ride-rate.component';
import { PassengerFavoritesComponent } from './passenger-favorites/passenger-favorites.component';
import { PassengerFavoritesScheduleDialogComponent } from './passenger-favorites/passenger-favorites-schedule-dialog/passenger-favorites-schedule-dialog/passenger-favorites-schedule-dialog.component';
import { PassengerFavoriteNameDialogComponent } from './passenger-history/passenger-favorite-name-dialog/passenger-favorite-name-dialog/passenger-favorite-name-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { PassengerGraphComponent } from './passenger-graph/passenger-graph/passenger-graph.component';
import { UserModule } from '../user/user.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    PassengerHomeComponent,
    PassengerOrderRideComponent,
    PassengerCurrentRideComponent,
    PassengerHistoryComponent,
    PassengerHistoryRideTableComponent,
    PassengerHistoryRideDetailsComponent,
    PassengerHistoryRideRateComponent,
    PassengerFavoritesComponent,
    PassengerFavoritesScheduleDialogComponent,
    PassengerFavoriteNameDialogComponent,
    PassengerGraphComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChartsModule,
    UserModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
  ],
  exports: [
    PassengerHomeComponent,
    PassengerOrderRideComponent,
  ]
})
export class PassengerModule { }
