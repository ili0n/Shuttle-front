import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RidePanicDialogComponent } from './ride-panic-dialog/ride-panic-dialog.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { RideRateDialogComponent } from './ride-rate-dialog/ride-rate-dialog.component';



@NgModule({
    declarations: [
        RidePanicDialogComponent,
        RideRateDialogComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        RidePanicDialogComponent
    ]
})
export class RideModule { }
