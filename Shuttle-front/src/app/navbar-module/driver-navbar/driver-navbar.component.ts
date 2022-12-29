import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
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
        this.userService.getActive(this.authService.getUserId()).subscribe({
            next: (value) => this.onActivityChange(value),
            error: (error) => console.error(error)
        });

        this.navbarService.onRefreshActivitySlider().subscribe({
            next: (canToggle) => this.setActivitySliderIsEnabled(canToggle),
            error: (error) => console.error(error)
        });
    }

    /**
     * @param canToggle Whether the activity slider can be changed.
     */
    private setActivitySliderIsEnabled(canToggle: boolean) {
        if (canToggle) {
            this.formGroupIsActive.controls['isActive'].enable();
        } else {
            this.formGroupIsActive.controls['isActive'].disable();
        }

        this.fetchIsActive();
    }

    /**
     * Fetch activity status from the backend.
     */
    private fetchIsActive(): void {
        this.userService.getActive(this.authService.getUserId()).subscribe({
            next: (active: boolean) => this.setIsActiveSliderValue(active),
            error: (error) => console.error(error)
        });
    }

    /**
     * @param isActive Whether the user is active.
     */
    private setIsActiveSliderValue(isActive: boolean): void {
        this.formGroupIsActive.setValue({ 'isActive': isActive });
    }


    /**
     * Called whenever the driver's active flag changes (manually or automatically).
     * @param active True if the driver is now active, false otherwise.
     */
    private onActivityChange(active: boolean) {
        console.log("DriverNavbarComponent::getActive() " + active);
        this.formGroupIsActive.setValue({ 'isActive': active });
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

    /**
     * Callback for whenever the driver changes his activity status manually.
     * The activity is updated on the server.
     */
    onToggleIsActive() {
        const id: number = this.authService.getUserId();
        const active: boolean = this.formGroupIsActive.getRawValue()['isActive'];

        if (!active) {
            this.userService.setInactive(id).subscribe({
                next: (value) => console.log("OK: " + value),
                error: (error) => console.error("NO:" + error)
            });
        } else {
            this.userService.setActive(id).subscribe({
                next: (value) => console.log("OK: " + value),
                error: (error) => console.error("NO:" + error)
            });
        }
    }

}
