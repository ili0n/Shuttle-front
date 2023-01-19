import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDriverComponent } from './create-driver/create-driver.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { AdminHistoryUserTableComponent } from './admin-history/admin-history-user-table/admin-history-user-table.component';
import { AdminHistoryRideTableComponent } from './admin-history/admin-history-ride-table/admin-history-ride-table.component';


@NgModule({
    declarations: [
        CreateDriverComponent,
        AdminHistoryComponent,
        AdminHistoryUserTableComponent,
        AdminHistoryRideTableComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        CreateDriverComponent,
    ],
})
export class AdminModule { }
