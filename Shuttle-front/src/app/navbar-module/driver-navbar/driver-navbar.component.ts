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

        this.navbarService.getDriverActiveState().subscribe({
            next: (isActive: boolean) => this.setDriverActiveState(isActive),
        });
    }

    protected onToggleIsActive(): void {
        const id: number = this.authService.getUserId();
        const active: boolean = this.formGroupIsActive.getRawValue()['isActive'];

        if (!active) {
            this.userService.setInactive(id).subscribe({
                next: (value) => this.onActiveChanged(value),
                error: (error) => console.error("NO:" + error)
            });
        } else {
            this.userService.setActive(id).subscribe({
                next: (value) => this.onActiveChanged(value),
                error: (error) => console.error("NO:" + error)
            });
        }
    }

    private setDriverActiveState(isActive: boolean): void {
        this.formGroupIsActive.setValue({ 'isActive': isActive });
    }

    private onActiveChanged(activeState: boolean): void {
        console.log("onActiveChanged()", activeState);
    }

    private setActiveStateSliderEnabled(canChange: boolean): void {
        if (canChange) {
            this.formGroupIsActive.controls['isActive'].enable();
        } else {
            this.formGroupIsActive.controls['isActive'].disable();
        }
    }

    /*
    Activity slider:

    [Driver] Begin Ride ---> active=true, canChange=false
    [Driver] Finish Ride ]
             Cancel Ride ]-> canChange=true
             Reject Ride ]
    
    [Driver] Fetch ride, is active ---> active=true, canChange=false
    */

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
}
