import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverHomeComponent } from '../driver-home/driver-home.component';
import { DriverHistoryComponent } from '../driver-history/driver-history.component';
import { DriverProfileComponent } from 'src/app/driver-profile/driver-profile.component';
import { DriverHomeCurrentRideComponent } from '../driver-home/driver-home-current-ride/driver-home-current-ride.component';
import { DriverHistoryRideTableComponent } from '../driver-history/driver-history-ride-table/driver-history-ride-table.component';
import { DriverHistoryRideDetailsComponent } from '../driver-history/driver-history-ride-details/driver-history-ride-details.component';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';
import { DriverService } from '../driver.service';
import { MaterialModule } from 'src/infrastructure/material.module';
import { RideModule } from 'src/app/ride/ride.module';
import { DriverHistoryRidePassengersComponent } from '../driver-history/driver-history-ride-passengers/driver-history-ride-passengers.component';

@NgModule({
    declarations: [
        DriverHomeComponent,
        DriverHomeCurrentRideComponent,
        DriverHistoryComponent,
        DriverHistoryRideTableComponent,
        DriverHistoryRideDetailsComponent,
        DriverHistoryRidePassengersComponent,
        RejectRideDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        DriverHomeComponent,
        DriverHomeCurrentRideComponent,
        DriverHistoryComponent,
        DriverHistoryRideTableComponent,
        DriverHistoryRideDetailsComponent,
        DriverHistoryRidePassengersComponent,
        RejectRideDialogComponent,
    ]
})
export class DriverModule { }
