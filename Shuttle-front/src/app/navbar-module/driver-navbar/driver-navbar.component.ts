import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {

    constructor(private router: Router) {
    }

    logout() {
        localStorage.clear();
        window.location.reload();
    }

    home() {
        this.router.navigate(["driver/home"]);
    }

    info() {
        this.router.navigate(["driver-info"]);
    }

}
