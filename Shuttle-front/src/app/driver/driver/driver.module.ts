import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverHomeComponent } from '../driver-home/driver-home.component';
import { DriverHistoryComponent } from '../driver-history/driver-history.component';
import { DriverProfileComponent } from 'src/app/driver/driver-profile/driver-profile.component';
import { DriverHomeCurrentRideComponent } from '../driver-home/driver-home-current-ride/driver-home-current-ride.component';
import { DriverHistoryRideTableComponent } from '../driver-history/driver-history-ride-table/driver-history-ride-table.component';
import { DriverHistoryRideDetailsComponent } from '../driver-history/driver-history-ride-details/driver-history-ride-details.component';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { DriverHistoryRidePassengersComponent } from '../driver-history/driver-history-ride-passengers/driver-history-ride-passengers.component';
import { UserModule } from 'src/app/user/user.module';
import { ChartsModule } from 'ng2-charts';
import { DriverGraphComponent } from '../driver-graph/driver-graph/driver-graph.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        DriverHomeComponent,
        DriverHomeCurrentRideComponent,
        DriverHistoryComponent,
        DriverHistoryRideTableComponent,
        DriverHistoryRideDetailsComponent,
        DriverHistoryRidePassengersComponent,
        RejectRideDialogComponent,
        DriverProfileComponent,
        DriverGraphComponent
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
        DriverHomeComponent,
        DriverHomeCurrentRideComponent,
        DriverHistoryComponent,
        DriverHistoryRideTableComponent,
        DriverHistoryRideDetailsComponent,
        DriverHistoryRidePassengersComponent,
        RejectRideDialogComponent,
        DriverProfileComponent,
    ]
})
export class DriverModule { }
