import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from 'src/app/admin/create-driver/create-driver.component';
import { LoginComponent } from 'src/app/login/component/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';

const routes: Routes = [
	{path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "admin/create-driver", component: CreateDriverComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
