import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph/graph.component';
import { ChartsModule } from 'ng2-charts';
import { UserGraphComponent } from './user-graph/user-graph.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/infrastructure/material.module';



@NgModule({
  declarations: [
    GraphComponent,
    UserGraphComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChartsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  exports: [
    GraphComponent,
    UserGraphComponent
  ]
})
export class UserModule { }
