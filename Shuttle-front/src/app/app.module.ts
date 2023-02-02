import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from 'src/infrastructure/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { UnregisteredPageComponent } from './unregistered-page/unregistered-page.component';
//import { EstimationFormComponent } from './estimation-form/estimation-form.component';
import {NavbarModuleModule} from "./navbar-module/navbar-module.module";
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver/driver.module';
import { RideModule } from './ride/ride.module';
import { LoginInterceptor } from './auth/interceptor/login.interceptor';
import { AuthModule } from './auth/auth.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
        //DriverProfileComponent,
        //EstimationMapComponent,
        UnregisteredPageComponent,
        //EstimationFormComponent,
        // DriverHomeComponent,
        //RejectRideDialogComponent,
        //SnackbarComponent,
        // DriverHomeCurrentRideComponent,
        // DriverHistoryComponent,
        // DriverHistoryRideTableComponent,
        // DriverHistoryRideDetailsComponent,
        // DriverHistoryRidePassengersComponent,
        //RegisterComponent,
        //LoginComponent,
        //ForgotPasswordComponent,
        //ResetPasswordComponent,
        //DriverProfileComponent,
        //UnregisteredPageComponent,
        //DriverHomeComponent,
        //RejectRideDialogComponent,
        //LoginComponent,
        //SnackbarComponent,
        //DriverHomeCurrentRideComponent,
        //LoginComponent,
        //DriverHistoryComponent,
        //DriverHistoryRideTableComponent,
        //DriverHistoryRideDetailsComponent,
        //DriverHistoryRidePassengersComponent,
        //PassengerDialog,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        AdminModule,
        SharedModule,
        MaterialModule,
        MatToolbarModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        NavbarModuleModule,
        PassengerModule,
        DriverModule,
        RideModule,
        MatNativeDateModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        ChartsModule,
    ],
    providers: [
        MatDatepickerModule,
        MatNativeDateModule,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoginInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
