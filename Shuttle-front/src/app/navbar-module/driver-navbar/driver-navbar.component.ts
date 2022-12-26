import {Component} from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {

    constructor(private router: Router, private authService: AuthService) {
    }

    logout() {
        this.authService.logout();
    }

    home() {
        this.router.navigate(["driver/home"]);
    }

    info() {
        this.router.navigate(["driver/info"]);
    }

}
