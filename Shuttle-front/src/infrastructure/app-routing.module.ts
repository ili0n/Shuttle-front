import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from 'src/app/admin/create-driver/create-driver.component';
import { LoginComponent } from 'src/app/login/component/login/login.component';
import { ForgotPasswordComponent } from 'src/app/login/component/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { ResetPasswordComponent } from 'src/app/login/component/reset-password/reset-password.component';
import { DriverProfileComponent } from 'src/app/driver-profile/driver-profile.component';
import { EstimationMapComponent } from '../app/estimation-map/estimation-map.component';
import { UnregisteredPageComponent } from 'src/app/unregistered-page/unregistered-page.component';

const routes: Routes = [
	{path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "admin/create-driver", component: CreateDriverComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', redirectTo: 'login'},
  {path: 'reset-password/:key', component: ResetPasswordComponent},
  {path: 'driver-info', component: DriverProfileComponent},
  {path: 'unregistered', component: UnregisteredPageComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
