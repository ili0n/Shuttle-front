import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/auth/auth.service';
import { DriverSocketService } from 'src/app/driver/driver-socket.service';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
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
    private ride: Ride | null = null; // Last saved ride.

    protected shouldShowRideBadge(): boolean {
        return this.ride?.status == RideStatus.Pending;
    }

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
    }

    private onConnectedToSocket(): void {
        this.driverSocketService.subToRide((ride: Ride) => {
            this.onFetchRide(ride);
        });

        this.driverSocketService.pingRide();

        // This is put here because setIsActive pings for a ride which uses the socket.
        // In reality, it'll only show an error in the console the first time, so it's
        // a big deal but it's okay.
        const id: number = this.authService.getUserId();
        this.userService.getActive(id).subscribe({
            next: (isActive: boolean) => {
                this.setIsActive(isActive);
            }
        });
    }

    private onFetchRide(ride: Ride) {
        if ((this.ride == null || this.ride.id != ride.id) && ride.status == RideStatus.Pending) {
            this.sharedService.showSnackBar("You have a new ride!", 3000);
        }

        const alreadyHasActiveRideAndThisOneIsPending = (
            this.ride != null &&
            [RideStatus.Accepted, RideStatus.Started].includes(this.ride.status) &&
            ride.status == RideStatus.Pending
        );
        if (this.ride == null || !alreadyHasActiveRideAndThisOneIsPending) {
            this.ride = ride;
        }

        if (this.ride.status == RideStatus.Started) { 
            this.formGroupIsActive.disable();
            this.setIsActive(true);
        } else {
            this.formGroupIsActive.enable();
        }
    }

    private setIsActive(isActive: boolean): void {
        this.formGroupIsActive.setValue({
            isActive: isActive
        });

        this.sendActiveStateToUserService(isActive);

        if (isActive) {
            this.driverSocketService.pingRide();
        }
    }

    // Toggled from the UI.
    protected onToggleIsActive(): void {
        const isActive: boolean = this.formGroupIsActive.getRawValue()['isActive'];
        this.setIsActive(isActive);
    }

    private sendActiveStateToUserService(active: boolean): void {
        const id: number = this.authService.getUserId();
        if (!active) {
            this.userService.setInactive(id).subscribe({
                next: (value) => /*this.getDriverActiveStateFromUserService(value)*/{},
                error: (error) => console.error("NO:" + error)
            });
        } else {
            this.userService.setActive(id).subscribe({
                next: (value) => /*this.getDriverActiveStateFromUserService(value)*/{},
                error: (error) => console.error("NO:" + error)
            });
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

    history() {
        this.router.navigate(["driver/history"]);
    }
}
