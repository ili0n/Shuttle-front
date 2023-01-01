import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RideService, RideRequest, Ride, RideStatus, RideRequestPassenger } from 'src/app/ride/ride.service';
import { RESTError } from 'src/app/shared/rest-error/rest-error';
import { SharedService } from 'src/app/shared/shared.service';
import { UserIdEmail } from 'src/app/user/user.service';
import { VehicleService, VehicleType } from 'src/app/vehicle/vehicle.service';
import { PassengerService } from '../passenger.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

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
    private loadingRoute: boolean = false;
    private stompClient: Stomp.Client | undefined;

    private lastDepartureText: string = "";
    private lastDestinationText: string = "";

    public otherPassengers: Array<RideRequestPassenger> = [];
    public myEmail: string = "";
    private ride: Ride | null = null;
    currentRide: Ride | null = null;
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
        private rideService: RideService,
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
        this.connectToSocket('socket');
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
            this.loadingRoute = true;
            this.textToLocation(departureText).subscribe({
                next: (result) => {
                    if (result[0]) {
                        this.depPos = L.latLng(result[0].lat, result[0].lon);
                        this.lastDepartureText = departureText;
                        this.textToLocation(destinationText).subscribe({
                            next: (result) => {
                                if (result[0]) {
                                    this.destPos = L.latLng(result[0].lat, result[0].lon);
                                    this.lastDestinationText = destinationText;
                                    this.drawRoute();
                                }
                            },
                            error: () => { this.destPos = null; this.lastDepartureText = ""; },
                        });
                    }
                },
                error: () => { this.depPos = null; this.lastDestinationText = ""; },
            });
        }
    }
    
    /**
     * Callback that's fired when the blur event is triggered on either departure
     * or destination input fields. It checks whether the route is different from
     * the current one and updates it if so. This is done to minimize API calls to
     * the map routing module.
     */
    updateFindRoute() {
        if (this.mainForm.get('route_form')?.valid) {
            const routeFormValues = this.mainForm.get('route_form')?.getRawValue();
            const departureText: string = routeFormValues['departure'];
            const destinationText: string = routeFormValues['destination'];

            if (departureText != this.lastDepartureText 
            || destinationText != this.lastDestinationText) {
                this.findRoute();
            }
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

            this.loadingRoute = false;
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

            let request: RideRequest = {
                locations: [
                    {
                        departure: {
                            address: formValue.get('route_form.departure')?.value,
                            latitude: Number(this.depPos?.lat),
                            longitude: Number(this.depPos?.lng),
                        },
                        destination: {
                            address: formValue.get('route_form.destination')?.value,
                            latitude: Number(this.destPos?.lat),
                            longitude: Number(this.destPos?.lng),
                        },
                    }
                ],
                passengers: passengersAll,
                vehicleType: formValue.get('route_options_form.vehicle_type')?.value,
                babyTransport: formValue.get('route_options_form.babies')?.value,
                petTransport: formValue.get('route_options_form.pets')?.value,
                hour: formValue.get('route_options_form.later.at_hour')?.value,
                minute: formValue.get('route_options_form.later.at_minute')?.value,
            }


            this.rideService.request(request).subscribe({
                next: (val: RideRequest) => {
                    //this.refreshRides(); There's no need to call this, because the back will
                    // notify all passengers of the ordered ride anyway.
                },
                error: (err) => {
                    if (err.status == HttpStatusCode.BadRequest) {
                        const error: RESTError = err.error;
                        this.sharedService.showSnackBar(error.message, 3000);
                    }
                }
            });
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
                    this.otherPassengers.push({id: user.id, email: user.email});
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

    /**
     * Callback that's called each time a new ride is received from the backend.
     * @param ride Ride object that was retrieved from the backend. It can be a pending ride or an active ride.
     */
    private onFetchRide(ride: Ride): void {
        console.log("Passenger got ride:", ride);

        if (ride.status == RideStatus.Rejected) {
            this.currentRide = null;
        } else {
            this.currentRide = ride;

            if (this.currentRide != null) {
                const depLoc = this.currentRide.locations[0].departure;
                const destLoc = this.currentRide.locations[this.currentRide.locations.length - 1].destination;
    
                this.depPos = new L.LatLng(depLoc.latitude, depLoc.longitude);
                this.destPos = new L.LatLng(destLoc.latitude, destLoc.longitude);

                // ride.passengers includes the current user, but he's added manually, so remove him
                // from this list.
                this.otherPassengers = ride.passengers.filter(p => p.id != this.authService.getUserId());
            }
        }

        this.drawRoute();
    }

    /**
     * @returns `true` if the passenger can order a new ride (i.e. he doesn't have one pending/active),
     * `false` otherwise.
     */
    canOrderRide(): boolean {
        return this.currentRide != null;
    }

    /**
     * 
     * @returns True if the route is being loaded from the map API. Used for the frontend to display
     * a progrss spinner.
     */
    isLoadingRoute(): boolean {
        return this.loadingRoute;
    }

    /**
     * 
     * @returns True if the user can click on the Order button.
     */
    canClickOnOrderButton(): boolean {
        return !this.isLoadingRoute() && this.mainForm.valid;
    }
    
    ///////////////////////////////////////////////////////////////////////

    
    /**
     * Connect to a websocket.
     * @param stompEndpoint Name of the endpoint used by Stomp to connect to a websocket.
     * Has to be one of the registered endpoints from `WebSocketConfiguration::registerStompEndpoints()`.
     * Must *not* begin with a `/`.
     */
    connectToSocket(stompEndpoint: string) {
        let ws = new SockJS(environment.serverOrigin + stompEndpoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = () => {};
        let self = this;
        this.stompClient.connect({}, () => {
            self.onConnectToWebSocket();
        });
    }

    /**
     * Disconnect from the websocket.
     */
    disconnectFromSocket() {
        this.stompClient?.disconnect(() => {});
    }

    /**
     * Subscribe to a given topic to listen to the messages in the topic.
     * @param topicName Name of the topic, *must not* start with a `/`.
     */
    subscribeToWebSocketTopic(topicName: string, callback: (msg: Stomp.Message) => any) {
        if (this.stompClient != undefined) {
            this.stompClient.subscribe('/' + topicName, callback);
        } else {
            console.error("Cannot subscribe to topic" + topicName + ". Not connected to a websocket!");
        }
    }

    /**
     * Send message to socket at the provided endpoint.
     * @param message Message payload.
     * @param socketEndpoint Endpoint to send it to. Check Java methods annotated with `@MessageMapping()` for possible endpoints.
     */
    sendMessageToSocket(message: string, socketEndpoint: string) {
        if (this.stompClient != undefined) {
            this.stompClient.send("/shuttle/" + socketEndpoint, {}, message);
        } else {
            console.error("Cannot send message" + message + " to endpoint " + socketEndpoint + ". Not connected to a websocket!");
        }
    }

    /**
     * Callback for when the component gets connected to a websocket.
     */
    onConnectToWebSocket() {
        const passengerId: number = this.authService.getUserId();

        // Whenever the backend has a new ride for me, I'll listen to it.

        this.subscribeToWebSocketTopic(`ride/passenger/${passengerId}`, (message) => {
            let r: Ride = JSON.parse(message.body);
            this.onFetchRide(r);
        });

        // Ask the backend to fetch the latest ride.
        this.refreshRides();
    }

    private refreshRides(): void {
        const passengerId: number = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/passenger/${passengerId}`);
    }

    /**
     * 
     * @returns True if this user has an ordered ride. This determines whether the right column
     * shows a form or just ride details.
     */
    hasOrderedRide(): boolean {
        return this.currentRide != null;
    }

    addressesOf(r: Ride): Array<string> {
        let res: Array<string> = [];

        for (let p of r.locations) {
            res.push(p.departure.address);
        }
        res.push(r.locations[r.locations.length - 1].destination.address);

        return res;
    }
}
