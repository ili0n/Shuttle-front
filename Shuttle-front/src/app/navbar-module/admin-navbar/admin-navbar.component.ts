import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
    constructor(private router: Router){
    }
    logout() {
        localStorage.clear();
        window.location.reload();
    }

    createDriver(){
        this.router.navigate(["admin/create-driver"]);
    }
}
