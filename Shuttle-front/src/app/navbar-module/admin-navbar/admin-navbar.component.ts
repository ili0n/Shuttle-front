import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
    constructor(private router: Router, private authService: AuthService) {
    }

    logout() {
        this.authService.logout();
    }

    createDriver(){
        this.router.navigate(["admin/create-driver"]);
    }

    history(){
        this.router.navigate(["admin/history"]);
    }
    home(){
        this.router.navigate(["admin/home"]);
    }
    panics(){
        this.router.navigate(["admin/panic"]);
    }
    graph() {
        this.router.navigate(["admin/graph"]);
    }
    block(){
        this.router.navigate(["admin/block"]);
    }
}
