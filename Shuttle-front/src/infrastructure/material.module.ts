import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatButtonModule,
        MatRadioModule,
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatButtonModule,
        MatRadioModule,
    ],
})
export class MaterialModule { }
