import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { Passenger, PassengerService } from 'src/app/passenger/passenger.service';
import { environment } from 'src/environments/environment';

interface RideRequestPassenger {
    id: number,
    email: string,
}

interface RideRequestSingleLocation {
    address: string,
    latitude: number,
    longitude: number,
}

interface RideRequestLocation {
    departure: RideRequestSingleLocation,
    destination: RideRequestSingleLocation,
}

interface RideRequest {
    passengers: Array<RideRequestPassenger>,
    locations: Array<RideRequestLocation>,
    babyTransport: boolean,
    petTransport: boolean,
}

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    requests: Array<RideRequest> = [];
    decision: string = "1";
    rejectFormGroup: FormGroup;
    map: any;
    rideRequest: RideRequest | undefined;

    constructor(private readonly formBuilder: FormBuilder, private httpClient: HttpClient, private passengerService: PassengerService) {
        this.rejectFormGroup = this.formBuilder.group({
            rejectionReason: ['', [Validators.required]],
        });
    }

    initMap(): void {
        this.map = this.map = L.map('map', {
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

    ngAfterViewInit(): void {
        this.initMap();
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-gradient1";
        this.subscribeToRides();
    }

    rejectRide(request: RideRequest) {
        if (this.rejectFormGroup.valid) {
            console.log("Send rejection REST call");
        }
    }

    beginRide(request: RideRequest) {
        console.log("Begin this ride.");
    }

    getRoutePoints(request: RideRequest): Array<RideRequestSingleLocation> {
        let res = request.locations.map(l => l.departure);
        res.push(request.locations[request.locations.length - 1].destination);
        return res;
    }

    subscribeToRides() {
        // TODO: Get driver ID from session.
        let path: string = 'api/ride/driver/' + 1 + '/ride-requests';

        const obs: Observable<Array<RideRequest>> = this.httpClient.get<Array<RideRequest>>(environment.serverOrigin + path, {
            observe: "body",
            responseType: "json",
        });

        obs.subscribe((receivedData: Array<RideRequest>) => {
            this.requests = receivedData;
            this.rideRequest = this.requests[0];
        });

    }
}
