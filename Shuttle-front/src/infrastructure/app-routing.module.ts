import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDriverComponent } from 'src/app/admin/create-driver/create-driver.component';
import { LoginComponent } from 'src/app/auth/login/component/login/login.component';
import { ForgotPasswordComponent } from 'src/app/auth/login/component/forgot-password/forgot-password.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { ResetPasswordComponent } from 'src/app/auth/login/component/reset-password/reset-password.component';
import { DriverProfileComponent } from 'src/app/driver/driver-profile/driver-profile.component';
import { UnregisteredPageComponent } from 'src/app/unregistered-page/unregistered-page.component';
import { DriverHomeComponent } from 'src/app/driver/driver-home/driver-home.component';
import {LoginGuard} from "../app/auth/guard/login.guard";
import {UserGuard} from 'src/app/auth/guard/user.guard';
import {PassengerHomeComponent} from 'src/app/passenger/passenger-home/passenger-home.component';
import { PassengerHistoryComponent } from 'src/app/passenger/passenger-history/passenger-history.component';
import { DriverHistoryComponent } from 'src/app/driver/driver-history/driver-history.component';
import { AdminHistoryComponent } from 'src/app/admin/admin-history/admin-history.component';
import { PassengerFavoritesComponent } from 'src/app/passenger/passenger-favorites/passenger-favorites.component';
import { PassengerGraphComponent } from 'src/app/passenger/passenger-graph/passenger-graph/passenger-graph.component';
import { DriverGraphComponent } from 'src/app/driver/driver-graph/driver-graph/driver-graph.component';
import {AdminHomeComponent} from "../app/admin/admin-home/admin-home.component";
import {AdminPanicComponent} from "../app/admin/admin-panic/admin-panic.component";
import {AdminGraphComponent} from "../app/admin/admin-report/admin-graph.component";
import {AdminBlockComponent} from "../app/admin/admin-block/admin-block.component";
import {PassengerProfileComponent} from "../app/passenger/passenger-profile/passenger-profile.component";
import {
    AdminDriverChangeApproveComponent
} from "../app/admin/admin-driver-change-approve/admin-driver-change-approve.component";
import {AdminChatComponent} from "../app/admin/admin-chat/admin-chat.component";

const routes: Routes = [
	{path: "login",
        component: LoginComponent,
        canActivate: [LoginGuard],
        loadChildren: () =>
            import('../app/auth/auth.module').then((m) => m.AuthModule),
    },
    {path: '', redirectTo: 'unregistered', pathMatch: 'full'},
  {path: "register", component: RegisterComponent, canActivate: [LoginGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', redirectTo: 'login'},
  {path: 'reset-password/:key', component: ResetPasswordComponent},
  {path: 'unregistered', component: UnregisteredPageComponent},

    {path: 'driver/info', component: DriverProfileComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'driver/home', component: DriverHomeComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'driver/history', component: DriverHistoryComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'driver/graph', component: DriverGraphComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},

    {path: "admin/create-driver", component: CreateDriverComponent , canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/history', component: AdminHistoryComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/home', component: AdminHomeComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/panic', component: AdminPanicComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/graph', component: AdminGraphComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/block', component: AdminBlockComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/driver-change', component: AdminDriverChangeApproveComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'admin/chat', component: AdminChatComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},


    {path: 'passenger/home', component: PassengerHomeComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
    {path: 'passenger/account', component: PassengerProfileComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
  {path: 'passenger/history', component: PassengerHistoryComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
  {path: 'passenger/favorites', component: PassengerFavoritesComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
  {path: 'passenger/graph', component: PassengerGraphComponent, canActivate: [UserGuard], loadChildren: () => import('../app/auth/auth.module').then((m) => m.AuthModule)},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
