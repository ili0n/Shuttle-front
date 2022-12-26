import {Component} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/user/user.service';

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {
    formGroupIsActive: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {
        this.formGroupIsActive = formBuilder.group({
            isActive: [],
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

    onToggleIsActive() {
        const id: number = this.authService.getUserId();
        const active: boolean = this.formGroupIsActive.getRawValue()['isActive'];

        if (active) {
            this.userService.setInactive(id).subscribe({
                next: (value) => {
                    console.log("OK: " + value);
                },
                error: (error) => {
                    console.error("NO:" + error);
                }
            });
        } else {
            this.userService.setActive(id).subscribe({
                next: (value) => {
                    console.log("OK: " + value);
                },
                error: (error) => {
                    console.error("NO:" + error);
                }
            });
        }
    }

}
