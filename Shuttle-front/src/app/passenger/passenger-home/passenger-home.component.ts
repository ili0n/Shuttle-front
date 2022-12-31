import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserIdEmail } from 'src/app/user/user.service';
import { VehicleService, VehicleType } from 'src/app/vehicle/vehicle.service';
import { PassengerService } from '../passenger.service';

@Component({
    selector: 'app-passenger-home',
    templateUrl: './passenger-home.component.html',
    styleUrls: ['./passenger-home.component.css']
})
export class PassengerHomeComponent implements OnInit, AfterViewInit {
    private map: any;
    private depPos: L.LatLng | null = null;
    private destPos: L.LatLng | null = null;
    private route: L.Routing.Control | null = null;

    public otherPassengers: Array<UserIdEmail> = [];
    public myEmail: string = "";
    mainForm: FormGroup;
    distance: number = -1;
    vehicleTypes: Array<VehicleType> = [];
    allowedHours: Array<Number> = [];
    allowedMinutes: Array<Number> = [];
    timeValidationErrorMsg: string = ""

    constructor(
        private sharedService: SharedService, 
        private passengerService: PassengerService, 
        private authService: AuthService, 
        private formBuilder: FormBuilder, 
        private http: HttpClient, 
        private vehicleService: VehicleService) {
        this.mainForm = this.formBuilder.group({
            route_form: this.formBuilder.group({
                departure: ['', [Validators.required]],
                destination: ['', [Validators.required]],
            }),
            route_options_form: this.formBuilder.group({
                vehicle_type: ['', [Validators.required]],
                babies: [false],
                pets: [false],
                passenger_email: ['', [Validators.email]], // Validation only, when submitting data,
                is_later: [false],
                // use `otherPassengers` to get the list of all added passengers.
                later: this.formBuilder.group({
                    at_hour: [],
                    at_minute: [],
                }),
            }),
        });

        this.mainForm.get('route_options_form')?.setValidators(
            PassengerHomeComponent.goodTimeValidator()
        );
    }

    ngOnInit(): void {
        this.vehicleTypes = this.vehicleService.getTypes();
        this.myEmail = this.authService.getUserEmail();
        this.recalculateAllowedMinutes();
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    /**
     * Callback that's fired when the user clicks on the 'Search Route' button.
     * Creates a route on the map from the given departure and destination points.
     */
    findRoute() {
        if (this.mainForm.get('route_form')?.valid) {
            const routeFormValues = this.mainForm.get('route_form')?.getRawValue();
            const departureText: string = routeFormValues['departure'];
            const destinationText: string = routeFormValues['destination'];

            // Convert departureText to LatLong.
            // Convert destinationText to LatLong.
            // Draw route.
            this.textToLocation(departureText).subscribe({
                next: (result) => {
                    if (result[0]) {
                        this.depPos = L.latLng(result[0].lat, result[0].lon);
                        this.textToLocation(destinationText).subscribe({
                            next: (result) => {
                                if (result[0]) {
                                    this.destPos = L.latLng(result[0].lat, result[0].lon);
                                    this.drawRoute();
                                }
                            },
                            error: () => { this.destPos = null; },
                        });
                    }
                },
                error: () => { this.depPos = null; },
            });
        }
    }

    /**
     * Draw route from pair (`this.depPos`, `this.destPos`).
     */
    private drawRoute() {
        if (this.depPos != null && this.destPos != null) {
            const waypoints = [this.depPos, this.destPos];

            if (this.route != null) {
                this.map.removeControl(this.route);
            }

            this.route = L.Routing.control({
                waypoints: waypoints,
                collapsible: true,
                fitSelectedRoutes: false,
                routeWhileDragging: false,
                plan: L.Routing.plan(waypoints, { draggableWaypoints: false, addWaypoints: false }),
                lineOptions:
                {
                    missingRouteTolerance: 0,
                    extendToWaypoints: true,
                    addWaypoints: false
                },
            }).addTo(this.map);
            this.route.hide();

            let self = this;

            this.route.on('routesfound', function (e) {
                let routes = e.routes;
                let summary = routes[0].summary;

                self.distance = summary.totalDistance;
                // Math.round(summary.totalTime % 3600 / 60) + ' minutes'
            });

            this.mainForm.get('route_options_form.vehicle_type')?.setValue(this.vehicleTypes[0].name);
        }
    }

    /** 
     * @returns `true` if a route specified by the user has been found. `false` otherwise.
     */
    hasRouteOnMap(): boolean {
        return this.route != null;
    }

    /**
     * Callback that's fired when the user clicks on the 'Order' button.
     * Orders the rout.
     */
    orderRoute() {
        if (this.mainForm.valid) {
            const formValue = this.mainForm;

            const mePassenger: UserIdEmail = {
                id: this.authService.getUserId(),
                email: this.authService.getUserEmail()
            };
            let passengersAll = [...this.otherPassengers];
            passengersAll.push(mePassenger);

            let result = {
                locations: [
                    {
                        departure: {
                            address: formValue.get('route_form.departure')?.value,
                            latitude: this.depPos?.lat,
                            longitude: this.depPos?.lng,
                        },
                        destination: {
                            address: formValue.get('route_form.destination')?.value,
                            latitude: this.destPos?.lat,
                            longitude: this.destPos?.lng,
                        },
                    }
                ],
                passengers: passengersAll,
                vehicleType: formValue.get('route_options_form.vehicle_type')?.value,
                babyTransport: formValue.get('route_options_form.babies')?.value,
                petTransport: formValue.get('route_options_form.pets')?.value,
                future: {
                    hour: formValue.get('route_options_form.later.at_hour')?.value,
                    minute: formValue.get('route_options_form.later.at_minute')?.value,
                }
            }

            console.log(result);
        }
    }

    /**
     * Callback that's fired when the user clicks on the '+' button next to a passenger input box.
     */
    onAddNewPassenger(): void {
        const newEmail: string = this.mainForm.get('route_options_form.passenger_email')?.getRawValue();

        if (this.otherPassengers.find(p => p.email == newEmail) == undefined && newEmail != this.myEmail) {
            this.passengerService.findByEmail(newEmail).subscribe({
                next: (user) => {
                    this.otherPassengers.push(user);
                    this.mainForm.get('route_options_form.passenger_email')?.setValue('');
                },
                error: () => {
                    this.sharedService.showSnackBar("User not found", 3000);
                },
            });
        } else {
            // Email already in the list.
        }
    }

    /**
     * Callback that's fired when the user clicks on the '-' button next to a passenger.
     * @param email Email to search by 
     */
    onRemovePassenger(email: string): void {
        if (email == this.myEmail) {
            return;
        }
        this.otherPassengers = this.otherPassengers.filter(psg => psg.email != email);
    }

    /**
     * @returns Total price for the ride in RSD.
     */
    getPriceFormatted(): string {
        const kmInt = Math.round(this.distance / 1000);
        const vehicleType: string = this.mainForm.get('route_options_form.vehicle_type')?.getRawValue();

        if (vehicleType) {
            const vehicleTypeCost: number = this.vehicleTypes.filter(t => t.name == vehicleType)[0].pricePerKm;
            const price = (kmInt * (120 + vehicleTypeCost));
            return price.toString() + " RSD";
        } else {
            return "? RSD";
        }
    }

    /**
     * @returns Whether the ride is scheduled for later.
     */
    isForLater(): boolean {
        return this.mainForm.get('route_options_form.is_later')?.getRawValue();
    }

    /**
     * Set `this.allowedHours` such that previous hours are not even in the list.
     */
    recalculateAllowedHours(): void {
        this.allowedHours = [];
        const now: Date = new Date();
        const hourMin: number = now.getHours();
        for (let h = hourMin; h <= 23; h++) {
            this.allowedHours.push(h);
        }
    }

    /**
     * Set list of minutes which one can select for scheduled rides in the future.
     */
    private recalculateAllowedMinutes(): void {
        this.allowedMinutes = [];
        for (let m = 0; m <= 59; m++) {
            this.allowedMinutes.push(m);
        }
    }

    /**
     * Initialize the map.
     * @param id HTML id of the element where the map will be rendered in.
     */
    private initMap(id: string): void {
        this.map = L.map(id, {
            center: [45.2396, 19.8227],
            zoom: 13,
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
    }

    /**
     * Perform geolocation.
     * @param location Text
     * @returns An observable which returns a list of locations (latitude+longitude).
     */
    private textToLocation(location: string): Observable<any> {
        return this.http.get(
            'https://nominatim.openstreetmap.org/search?format=json&q=' + location
        );
    }

    /**
     * Perform inverse geolocation.
     * @param lat Latitude
     * @param lon Longitude
     * @returns ?
     */
    private locationToText(lat: number, lon: number): Observable<any> {
        return this.http.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
        );
    }

    /**
     * @param meters Distance in meters
     * @returns Distance string formatted with 'm' or 'km' based on the distance.
     */
    getDistanceFormatted(meters: number): string {
        if (meters >= 1000) {
            return (meters / 1000).toFixed(2).toString() + "km";
        } else {
            return meters.toFixed(2).toString() + "m";
        }
    }

    /**
     * Validation logic pseudocode:
     * ```
        if is_later not checked:
            return null;
        if either time field is not filled in:
            return null;
        if time specified is in past or is 5 hours after the current moment:
            return error;
        return null;
     * ```
     * @returns A validator function.
     */
    static goodTimeValidator(): ValidatorFn {
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
        };
    }
}
