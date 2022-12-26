import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from 'src/app/admin/create-driver/create-driver.component';
import { LoginComponent } from 'src/app/auth/login/component/login/login.component';
import { ForgotPasswordComponent } from 'src/app/auth/login/component/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { ResetPasswordComponent } from 'src/app/auth/login/component/reset-password/reset-password.component';
import { DriverProfileComponent } from 'src/app/driver-profile/driver-profile.component';
import { DriverHomeComponent } from 'src/app/driver/driver-home/driver-home.component';
import {LoginGuard} from "../app/auth/guard/login.guard";
import { UserGuard } from 'src/app/auth/guard/user.guard';

const routes: Routes = [
	{path: "login",
        component: LoginComponent,
        canActivate: [LoginGuard],
        loadChildren: () =>
            import('../app/auth/auth.module').then((m) => m.AuthModule),
    },
  {path: "register", component: RegisterComponent, canActivate: [LoginGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', redirectTo: 'login'},
  {path: 'reset-password/:key', component: ResetPasswordComponent},
  {path: 'driver/info', component: DriverProfileComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
  {path: 'driver/home', component: DriverHomeComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
  {path: "admin/create-driver", component: CreateDriverComponent , canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
