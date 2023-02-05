import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDriverComponent } from './create-driver/create-driver.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { AdminHistoryUserTableComponent } from './admin-history/admin-history-user-table/admin-history-user-table.component';
import { AdminHistoryRideTableComponent } from './admin-history/admin-history-ride-table/admin-history-ride-table.component';
import { AdminHistoryRideDetailsComponent } from './admin-history/admin-history-ride-details/admin-history-ride-details.component';
import { AdminHistoryRidePassengersComponent } from './admin-history/admin-history-ride-passengers/admin-history-ride-passengers.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminPanicComponent } from './admin-panic/admin-panic.component';
import { AdminPanicDetailsComponent } from './admin-panic/admin-panic-details/admin-panic-details.component';
import { AdminGraphComponent } from './admin-report/admin-graph.component';
import {UserModule} from "../user/user.module";
import { AdminBlockComponent } from './admin-block/admin-block.component';
import { AdminProfileOverviewComponent } from './admin-block/admin-profile-overview/admin-profile-overview.component';
import { AdminNoteComponent } from './admin-block/admin-note/admin-note.component';
import { AdminDriverChangeApproveComponent } from './admin-driver-change-approve/admin-driver-change-approve.component';
import { AdminDriverProfileChangeComponent } from './admin-driver-change-approve/admin-driver-profile-change/admin-driver-profile-change.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';


@NgModule({
    declarations: [
        CreateDriverComponent,
        AdminHistoryComponent,
        AdminHistoryUserTableComponent,
        AdminHistoryRideTableComponent,
        AdminHistoryRideDetailsComponent,
        AdminHistoryRidePassengersComponent,
        AdminHomeComponent,
        AdminPanicComponent,
        AdminPanicDetailsComponent,
        AdminGraphComponent,
        AdminBlockComponent,
        AdminProfileOverviewComponent,
        AdminNoteComponent,
        AdminDriverChangeApproveComponent,
        AdminDriverProfileChangeComponent,
        AdminChatComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        UserModule
    ],
    exports: [
        CreateDriverComponent,
    ],
})
export class AdminModule { }
