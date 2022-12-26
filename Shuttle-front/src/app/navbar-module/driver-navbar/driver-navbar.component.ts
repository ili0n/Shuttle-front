import {Component} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
    formGroupIsActive: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
        this.formGroupIsActive = formBuilder.group({
            isActive: [false],
        });
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
