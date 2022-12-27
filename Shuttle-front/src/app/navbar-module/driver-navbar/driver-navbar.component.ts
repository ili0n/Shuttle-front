import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/user/user.service';
import { __values } from 'tslib';
import { NavbarService } from '../navbar.service';

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent implements OnInit {
    formGroupIsActive: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService, private navbarService: NavbarService) {
        this.formGroupIsActive = formBuilder.group({
            isActive: [true],
        });
    }

    ngOnInit(): void {
        this.fetchIsActive();
        this.fetchCanChangeActivity();
        this.fetchRefreshToggle();
    }

    private fetchIsActive(): void {
        this.userService.getActive(this.authService.getUserId()).subscribe({
            next: (value) => {
                console.log("DriverNavbarComponent::getActive() " + value);
                let active = value;
                this.formGroupIsActive.setValue({'isActive': active});
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    private fetchCanChangeActivity(): void {
        this.navbarService.getCanToggleActivity().subscribe({
            next: (canChange) => {
                if (canChange) {
                    this.formGroupIsActive.controls['isActive'].enable();
                    this.fetchIsActive();
                } else {
                    this.formGroupIsActive.controls['isActive'].disable();
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    private fetchRefreshToggle(): void {
        this.navbarService.getRefreshToggle().subscribe({
            next: () => {
                this.fetchIsActive();
            }
        })
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

        if (!active) {
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
