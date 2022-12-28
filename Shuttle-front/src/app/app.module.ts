import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from 'src/infrastructure/app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {RegisterComponent} from './register/register.component'

import {LoginComponent} from './auth/login/component/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UnregisteredNavbarComponent} from './navbar-module/unregistered-navbar/unregistered-navbar.component';
import {MaterialModule} from 'src/infrastructure/material.module';
import {AdminModule} from './admin/admin.module';
import {ForgotPasswordComponent} from './auth/login/component/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/login/component/reset-password/reset-password.component';
import {SharedModule} from './shared/shared.module';
import {DriverProfileComponent} from './driver-profile/driver-profile.component';
import {DriverHomeComponent} from './driver/driver-home/driver-home.component';
import {RejectRideDialogComponent} from './driver/reject-ride-dialog/reject-ride-dialog.component';
import {NavbarModuleModule} from "./navbar-module/navbar-module.module";
import {
    DriverRideHistoryComponent
} from './driver/driver-ride-history/driver-ride-history/driver-ride-history.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Interceptor} from "./auth/interceptor/login.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        DriverProfileComponent,
        DriverHomeComponent,
        RejectRideDialogComponent,
        LoginComponent,
        DriverRideHistoryComponent
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
        MatDatepickerModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: Interceptor,
        multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
