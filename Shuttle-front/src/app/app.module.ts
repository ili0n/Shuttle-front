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
import { ForgotPasswordComponent } from './auth/login/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/login/component/reset-password/reset-password.component';
import { SharedModule } from './shared/shared.module';
import { EstimationMapComponent } from './estimation-map/estimation-map.component';
import { UnregisteredPageComponent } from './unregistered-page/unregistered-page.component';
import { EstimationFormComponent } from './estimation-form/estimation-form.component';
import {NavbarModuleModule} from "./navbar-module/navbar-module.module";
import { SnackbarComponent } from './util/snackbar/snackbar/snackbar.component';
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver/driver.module';
import { RideModule } from './ride/ride.module';
import { LoginInterceptor } from './auth/interceptor/login.interceptor';
import { AuthModule } from './auth/auth.module';

@NgModule({
    declarations: [
        AppComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        //DriverProfileComponent,
        EstimationMapComponent,
        UnregisteredPageComponent,
        EstimationFormComponent,
        // DriverHomeComponent,
        //RejectRideDialogComponent,
        SnackbarComponent,
        // DriverHomeCurrentRideComponent,
        // DriverHistoryComponent,
        // DriverHistoryRideTableComponent,
        // DriverHistoryRideDetailsComponent,
        // DriverHistoryRidePassengersComponent,
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
        AuthModule,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: LoginInterceptor,
        multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
