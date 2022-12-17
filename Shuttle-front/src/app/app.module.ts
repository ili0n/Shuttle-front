import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from 'src/infrastructure/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register/register.component'

import { LoginComponent } from './login/component/login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/infrastructure/material.module';
import { AdminModule } from './admin/admin.module';
import { ForgotPasswordComponent } from './login/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/component/reset-password/reset-password.component';
import { SharedModule } from './shared/shared.module';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { EstimationMapComponent } from './estimation-map/estimation-map.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        NavbarComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        DriverProfileComponent,
        EstimationMapComponent,
    ],
    imports: [
        HttpClientModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        AdminModule,
        SharedModule,
        MaterialModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
