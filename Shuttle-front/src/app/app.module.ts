import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from 'src/infrastructure/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { RegisterComponent } from './register/register.component'

import { LoginComponent } from './auth/login/component/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UnregisteredNavbarComponent } from './navbar-module/unregistered-navbar/unregistered-navbar.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminModule } from './admin/admin.module';
import { ForgotPasswordComponent } from './auth/login/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/login/component/reset-password/reset-password.component';
import { SharedModule } from './shared/shared.module';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { EstimationMapComponent } from './estimation-map/estimation-map.component';
import { UnregisteredPageComponent } from './unregistered-page/unregistered-page.component';
import { EstimationFormComponent } from './estimation-form/estimation-form.component';
import { DriverHomeComponent } from './driver/driver-home/driver-home.component';
import { RejectRideDialogComponent } from './driver/reject-ride-dialog/reject-ride-dialog.component';
import {NavbarModuleModule} from "./navbar-module/navbar-module.module";
import { PassengerModule } from './passenger/passenger.module';
import { DriverModule } from './driver/driver/driver.module';
import { RideModule } from './ride/ride.module';
import { RidePanicDialogComponent } from './ride/ride-panic-dialog/ride-panic-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        DriverProfileComponent,
        EstimationMapComponent,
        UnregisteredPageComponent,
        EstimationFormComponent,
        DriverHomeComponent,
        RejectRideDialogComponent,
        LoginComponent,
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
