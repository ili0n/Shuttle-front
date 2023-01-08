import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
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
        this.navbarService.getCanChangeActiveState().subscribe({
            next: (canChange: boolean) => this.setActiveStateSliderEnabled(canChange),
        });

        // driver-home ---> navbar ---> [here]
        this.navbarService.getDriverActiveFromDriverState().subscribe({
            next: (isActive: boolean) => {
                this.sendActiveStateToUserService(isActive);
                this.formGroupIsActive.setValue({ 'isActive': isActive });
            },
        });

        // backend ---> [here] ---> navbar ---> driver-home
        this.userService.getActive(this.authService.getUserId()).subscribe({
            next: (isActive: boolean) => {
                this.getDriverActiveStateFromUserService(isActive);
            }
        })
    }

    // Toggled from the UI.
    protected onToggleIsActive(): void {
        const active: boolean = this.formGroupIsActive.getRawValue()['isActive'];
        this.sendActiveStateToUserService(active);
    }

    private sendActiveStateToUserService(active: boolean): void {
        const id: number = this.authService.getUserId();
        if (!active) {
            this.userService.setInactive(id).subscribe({
                next: (value) => this.getDriverActiveStateFromUserService(value),
                error: (error) => console.error("NO:" + error)
            });
        } else {
            this.userService.setActive(id).subscribe({
                next: (value) => this.getDriverActiveStateFromUserService(value),
                error: (error) => console.error("NO:" + error)
            });
        }
    }

    private getDriverActiveStateFromUserService(isActive: boolean): void {
        this.navbarService.setDriverActiveFromOutsideState(isActive);
        this.formGroupIsActive.setValue({ 'isActive': isActive });
    }

    private setActiveStateSliderEnabled(canChange: boolean): void {
        if (canChange) {
            this.formGroupIsActive.controls['isActive'].enable();
        } else {
            this.formGroupIsActive.controls['isActive'].disable();
        }
    }

    /*********************************************************************************************/

    logout() {
        this.authService.logout();
    }

    home() {
        this.router.navigate(["driver/home"]);
    }

    info() {
        this.router.navigate(["driver/info"]);
    }
    history(){
        this.router.navigate(["driver/ride-history"])
    }

}
