import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserIdEmail, UserService } from 'src/app/user/user.service';
import { VehicleService, VehicleType } from 'src/app/vehicle/vehicle.service';
import { Passenger } from '../passenger.service';

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
    //public otherPassengersEmails: Array<string> = [];
    formGroup: FormGroup;
    distance: number = -1;
    vehicleTypes: Array<VehicleType> = [];

    constructor(private sharedService: SharedService, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, private http: HttpClient, private vehicleService: VehicleService) {
        this.formGroup = this.formBuilder.group({
            departure: ['', []],
            destination: ['', []],
            vehicleType: [],
            vehicleBabies: [false],
            vehiclePets: [false],
            passenger_email: ['', [Validators.email]],
        });
    }

    ngOnInit(): void {
        this.vehicleTypes = this.vehicleService.getTypes();
        this.myEmail = this.authService.getUserEmail();
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    foundRoute(): boolean {
        return this.route != null;
    }

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

    onSubmit(): void {
        if (this.formGroup?.valid) {
            console.log(this.formGroup.getRawValue());
        }

        const departureText: string = this.formGroup.getRawValue()['departure'];
        const destinationText: string = this.formGroup.getRawValue()['destination'];

        this.textToLocation(departureText).subscribe({
            next: (result) => {
                this.depPos = L.latLng(result[0].lat, result[0].lon);
                this.textToLocation(destinationText).subscribe({
                    next: (result) => {
                        this.destPos = L.latLng(result[0].lat, result[0].lon);
                        this.drawRoute();
                    },
                    error: () => { this.destPos = null; },
                });
            },
            error: () => { this.depPos = null; },
        });
    }

    private textToLocation(location: string): Observable<any> {
        return this.http.get(
            'https://nominatim.openstreetmap.org/search?format=json&q=' + location
        );
    }

    private locationToText(lat: number, lon: number): Observable<any> {
        return this.http.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
        );
    }

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

            this.formGroup.controls['vehicleType'].setValue(this.vehicleTypes[0].name);
        }
    }

    metersFormat(meters: number): string {
        if (meters >= 1000) {
            return (meters / 1000).toFixed(2).toString() + "km";
        } else {
            return meters.toFixed(2).toString() + "m";
        }
    }

    calcPrice(): number {
        const kmInt = Math.round(this.distance / 1000);
        const vehicleType: string = this.formGroup.getRawValue()['vehicleType'];
        const vehicleTypeCost: number = this.vehicleTypes.filter(t => t.name == vehicleType)[0].pricePerKm;
        const price = (kmInt * (120 + vehicleTypeCost));
        return price;
    }

    priceFormat(price: number): string {
        return price.toString() + " RSD";
    }

    onAddNewPassenger(): void {
        const newEmail: string = this.formGroup.getRawValue()['passenger_email'];

        if (this.otherPassengers.find(p => p.email == newEmail) == undefined && newEmail != this.myEmail) {
            this.userService.findByEmail(newEmail).subscribe({
                next: (user) => {
                    this.otherPassengers.push(user);
                    //this.otherPassengersEmails.push(user.email);
                    this.formGroup.controls['passenger_email'].setValue('');
                },
                error: (error) => {
                    this.sharedService.showSnackBar("User not found", 3000);
                },
            });
        } else {
            // Email already in the list.
        }
    }

    onRemovePassenger(email: string) {
        if (email == this.myEmail) {
            return;
        }

        this.otherPassengers = this.otherPassengers.filter(psg => psg.email != email);
        //this.otherPassengersEmails = this.otherPassengersEmails.filter(em => em != email);
    }
}
