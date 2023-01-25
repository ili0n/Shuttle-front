import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/infrastructure/material.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/component/login/login.component';
import { LoginInterceptor } from './interceptor/login.interceptor';
import { LoginGuard } from './guard/login.guard';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
  ]
})
export class AuthModule { }
