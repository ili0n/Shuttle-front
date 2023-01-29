import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from 'src/app/user/graph/graph/graph.component';
import { UserModule } from 'src/app/user/user.module';
import { MaterialModule } from 'src/infrastructure/material.module';
import { ChartsModule } from 'ng2-charts';
import { DriverGraphComponent } from '../driver-graph/driver-graph/driver-graph.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
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
    ]
})
export class DriverModule { }
