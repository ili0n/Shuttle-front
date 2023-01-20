import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DriverSocketService } from 'src/app/driver/driver-socket.service';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserService } from 'src/app/user/user.service';
import { VehicleLocationDTO } from 'src/app/vehicle/vehicle.service';
import { __values } from 'tslib';
import { NavbarService } from '../navbar.service';

@Component({
    selector: 'app-driver-navbar',
    templateUrl: './driver-navbar.component.html',
    styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent implements OnInit {
    formGroupIsActive: FormGroup;
    private ride: Ride | null = null; // Last saved ride.

    constructor(
        private readonly formBuilder: FormBuilder, 
        private authService: AuthService, 
        private router: Router, 
        private userService: UserService, 
        private navbarService: NavbarService,
        private driverSocketService: DriverSocketService,
        private sharedService: SharedService
    ) {
        this.formGroupIsActive = formBuilder.group({
            isActive: [true],
        });
    }
    ngOnInit(): void {
        this.driverSocketService.onConnectedToSocket().subscribe({
            next: (val: boolean) => {
                if (val) {
                    this.onConnectedToSocket();
                }
            }
        });

        // this.navbarService.getCanChangeActiveState().subscribe({
        //     next: (canChange: boolean) => this.setActiveStateSliderEnabled(canChange),
        // });

        // // driver-home ---> navbar ---> [here]
        // this.navbarService.getDriverActiveFromDriverState().subscribe({
        //     next: (isActive: boolean) => {
        //         this.sendActiveStateToUserService(isActive);
        //         this.formGroupIsActive.setValue({ 'isActive': isActive });
        //     },
        // });

        // // backend ---> [here] ---> navbar ---> driver-home
        // this.userService.getActive(this.authService.getUserId()).subscribe({
        //     next: (isActive: boolean) => {
        //         this.getDriverActiveStateFromUserService(isActive);
        //     }
        // })
    }

    private onConnectedToSocket(): void {
        this.driverSocketService.subToRide((ride: Ride) => {
            this.onFetchRide(ride);
        });

        this.driverSocketService.pingRide();
    }

    private onFetchRide(ride: Ride) {
        if ((this.ride == null || this.ride.id != ride.id) && ride.status == RideStatus.Pending) {
            this.sharedService.showSnackBar("You have a new ride!", 3000);
            this.ride = ride;
        }
    }

    // Toggled from the UI.
    protected onToggleIsActive(): void {
        const active: boolean = this.formGroupIsActive.getRawValue()['isActive'];
        //this.sendActiveStateToUserService(active);
    }

    // private sendActiveStateToUserService(active: boolean): void {
    //     const id: number = this.authService.getUserId();
    //     if (!active) {
    //         this.userService.setInactive(id).subscribe({
    //             next: (value) => this.getDriverActiveStateFromUserService(value),
    //             error: (error) => console.error("NO:" + error)
    //         });
    //     } else {
    //         this.userService.setActive(id).subscribe({
    //             next: (value) => this.getDriverActiveStateFromUserService(value),
    //             error: (error) => console.error("NO:" + error)
    //         });
    //     }
    // }

    // private getDriverActiveStateFromUserService(isActive: boolean): void {
    //     this.navbarService.setDriverActiveFromOutsideState(isActive);
    //     this.formGroupIsActive.setValue({ 'isActive': isActive });
    // }

    // private setActiveStateSliderEnabled(canChange: boolean): void {
    //     if (canChange) {
    //         this.formGroupIsActive.controls['isActive'].enable();
    //     } else {
    //         this.formGroupIsActive.controls['isActive'].disable();
    //     }
    // }

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

    history() {
        this.router.navigate(["driver/history"]);
    }
}
