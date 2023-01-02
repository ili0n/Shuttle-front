import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { RideRequest } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserIdEmail } from 'src/app/user/user.service';
import { VehicleService, VehicleType } from 'src/app/vehicle/vehicle.service';

export interface RecalculateRouteDTO {
    departure: string,
    destination: string,
}

@Component({
  selector: 'app-passenger-order-ride',
  templateUrl: './passenger-order-ride.component.html',
  styleUrls: ['./passenger-order-ride.component.css']
})
export class PassengerOrderRideComponent implements OnInit {
    @Input() isRouteRecalculating: boolean = false;
    @Input() isRouteFound: boolean = false;
    @Input() routeDistance: number = 0;
    @Input() depPos!: L.LatLng;
    @Input() destPos!: L.LatLng;
    @Output() private recalculateRouteEvent = new EventEmitter<RecalculateRouteDTO>();
    @Output() private orderRideEvent = new EventEmitter<RideRequest>();

    protected departurePrev = "";
    protected destinationPrev = "";
    protected vehicleTypes: Array<VehicleType> = [];
    protected otherPassengers: Array<UserIdEmail> = [];
    protected mainForm!: FormGroup;
    protected allowedHours: Array<number> = [];
    protected allowedMinutes: Array<number> = [];

    constructor(private formBuilder: FormBuilder,
                private vehicleService: VehicleService,
                private authService: AuthService,
                private sharedService: SharedService,
                private passengerService: PassengerService) {
        this.initMainForm();
        this.initAllowedTime();
    }

    ngOnInit(): void {
        this.vehicleTypes = this.vehicleService.getTypes();
    }

    /**
     * Set selectable hours and minutes when scheduling in the future.
     */
    private initAllowedTime(): void {
        for (let i = 0; i <= 23; i++) {
            this.allowedHours.push(i);
        }
        for (let i = 0; i <= 59; i++) {
            this.allowedMinutes.push(i);
        }
    }

    /**
     * Initialize form group.
     */
    private initMainForm() {
        this.mainForm = this.formBuilder.group({
            route_form: this.formBuilder.group({
                departure: ['', [Validators.required]],
                destination: ['', [Validators.required]],
            }),
            route_options_form: this.formBuilder.group({
                vehicle_type: ['', [Validators.required]],
                babies: [false],
                pets: [false],
                passenger_email: ['', [Validators.email]], // Only used for validation!
                is_later: [false],
                later: this.formBuilder.group({
                    at_hour: [],
                    at_minute: [],
                }),
            }),
        });

        this.mainForm.get('route_options_form')?.setValidators(
           PassengerOrderRideComponent.goodTimeValidator()
        );
    }

    /**
     * @returns A validator function that determines whether the selected time for a ride in the
     * future is valid.
     */
    private static goodTimeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const inFuture: boolean = control.get('is_later')?.value;
            if (!inFuture) {
                control.get('later.at_hour')?.setErrors(null);
                control.get('later.at_minute')?.setErrors(null);
                return null;
            }

            const hval: string = control.get('later.at_hour')?.value;
            const mval: string = control.get('later.at_minute')?.value;

            if (hval == null || mval == null) {
                const err = { required: true };
                if (hval == null) {
                    control.get('later.at_hour')?.setErrors(err);
                }

                if (mval == null) {
                    control.get('later.at_minute')?.setErrors(err);
                }
                return err;          
            }

            const hour: number = Number(hval);
            const minute: number = Number(mval);
            const total_m: number = (hour * 60) + minute;

            const now: Date = new Date();
            const now_m: number = (now.getHours() * 60) + now.getMinutes();

            const delta: number = total_m - now_m;
            const deltaMax: number = 5 * 60; // 5 hours.
            if (delta < 0 || delta > deltaMax) {
                const err = { badTime: true };
                control.get('later.at_hour')?.setErrors(err);
                control.get('later.at_minute')?.setErrors(err);
                return err;
            }

            control.get('later.at_hour')?.setErrors(null);
            control.get('later.at_minute')?.setErrors(null);
            return null;
        }
    }

    protected recalculateRoute(): void {
        if (!this.isRouteFormValid()) {
            return;
        }

        const departure = this.mainForm.get('route_form.departure')!.value;
        const destination = this.mainForm.get('route_form.destination')!.value

        if (departure == this.departurePrev && destination == this.destinationPrev) {
            // No need to recalculate the route if both endpoints are the same.
            return;
        }
        
        this.departurePrev = departure;
        this.destinationPrev = destination;

        this.recalculateRouteEmit({
            departure: departure,
            destination: destination,
        });
    }

    private recalculateRouteEmit(data: RecalculateRouteDTO): void {
        this.recalculateRouteEvent.emit(data);
    }

    protected isRouteFormValid(): boolean {
        return this.mainForm.get('route_form')!.valid;
    }

    protected canOrderRide(): boolean {
        return this.mainForm.valid;
    }

    protected getMyEmail(): string {
        return this.authService.getUserEmail();
    }

    protected onRemovePassenger(email: string): void {
        if (email == this.getMyEmail()) {
            return;
        }
        this.otherPassengers = this.otherPassengers.filter(psg => psg.email != email);
    }

    protected onAddPassenger(): void {
        const newEmail: string = this.mainForm.get('route_options_form.passenger_email')?.getRawValue();

        if (this.otherPassengers.find(p => p.email == newEmail) != undefined) {
            this.sharedService.showSnackBar("User already invited!", 2000);
            return;
        }

        if (newEmail == this.getMyEmail()) {
            this.sharedService.showSnackBar("You cannot invite yourself!", 2000);
            return;
        }

        this.passengerService.findByEmail(newEmail).subscribe({
            next: (value: UserIdEmail) => {
                this.addPassenger(value);
            },
            error: () => {
                this.sharedService.showSnackBar("User not found!", 2000);
            }
        })
    }

    private addPassenger(value: UserIdEmail) {
        this.otherPassengers.push({id: value.id, email: value.email});
        this.mainForm.get('route_options_form.passenger_email')?.setValue('');
    }

    protected getRouteDistanceStr(): string {
        if (this.routeDistance > 1000) {
            return (this.routeDistance / 1000.0).toFixed(2) + "km";
        } else {
            return this.routeDistance.toFixed(2) + "m"; 
        }
    }

    protected getRoutePrice(): string {
        const kmInt = Math.round(this.routeDistance / 1000);
        const vehicleType: string = this.mainForm.get('route_options_form.vehicle_type')?.getRawValue();

        if (vehicleType) {
            const vehicleTypeCost: number = this.vehicleTypes.filter(t => t.name == vehicleType)[0].pricePerKm;
            const price = (kmInt * (120 + vehicleTypeCost));
            return price.toString() + " RSD";
        } else {
            return "? RSD";
        }
    }

    protected isOrderingLater(): boolean {
        return this.mainForm.get('route_options_form.is_later')!.getRawValue();
    }

    protected orderRide(): void {
        // otherPassengers does not include the user ordering the ride, so add him now.

        const mePassenger: UserIdEmail = {
            id: this.authService.getUserId(),
            email: this.authService.getUserEmail()
        };
        let passengersAll = [...this.otherPassengers];
        passengersAll.push(mePassenger);

        const request: RideRequest = {
            locations: [
                {
                    departure: {
                        address: this.mainForm.get('route_form.departure')?.value,
                        latitude: Number(this.depPos.lat),
                        longitude: Number(this.depPos.lng),
                    },
                    destination: {
                        address: this.mainForm.get('route_form.destination')?.value,
                        latitude: Number(this.destPos.lat),
                        longitude: Number(this.destPos.lng),
                    },
                }
            ],
            passengers: passengersAll,
            vehicleType: this.mainForm.get('route_options_form.vehicle_type')?.value,
            babyTransport: this.mainForm.get('route_options_form.babies')?.value,
            petTransport: this.mainForm.get('route_options_form.pets')?.value,
            hour: this.mainForm.get('route_options_form.later.at_hour')?.value,
            minute: this.mainForm.get('route_options_form.later.at_minute')?.value,
        }

        this.orderRideEvent.emit(request);
    }
}
