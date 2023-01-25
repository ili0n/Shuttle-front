import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/infrastructure/material.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/component/login/login.component';
import { LoginInterceptor } from './interceptor/login.interceptor';
import { LoginGuard } from './guard/login.guard';
import { ForgotPasswordComponent } from './login/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/component/reset-password/reset-password.component';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ]
})
export class AuthModule { }
