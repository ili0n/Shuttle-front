import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/login/component/login/login.component';
import { ForgotPasswordComponent } from 'src/app/login/component/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/register/register.component';

const routes: Routes = [
	{path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
