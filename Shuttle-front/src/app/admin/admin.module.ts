import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDriverComponent } from './create-driver/create-driver.component';
import { MaterialModule } from 'src/infrastructure/material.module';

@NgModule({
    declarations: [
        CreateDriverComponent
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
