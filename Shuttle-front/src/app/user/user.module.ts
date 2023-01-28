import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph/graph.component';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    GraphComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ],
  exports: [
    GraphComponent
  ]
})
export class UserModule { }
