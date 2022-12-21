import { JsonPipe, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, Observable, startWith, Subscription } from 'rxjs';
import { Passenger, PassengerService } from 'src/app/passenger/passenger.service';
import { waitForElement } from 'src/app/util/dom-util';
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
export class DriverHomeComponent implements OnInit, OnDestroy {
    decision: string = "1";
    rejectFormGroup: FormGroup;
    private map: any;
    rideRequest: RideRequest | null = null;
    private pull: Subscription;

    constructor(private readonly formBuilder: FormBuilder, private httpClient: HttpClient, private passengerService: PassengerService) {
        this.rejectFormGroup = this.formBuilder.group({
            rejectionReason: ['', [Validators.required]],
        });

        this.pull = interval(3 * 1000).pipe(startWith(0)).subscribe(r => {
            this.pullNewRideRequest();
        });
    }

    initMap(id: string): void {
        this.map = this.map = L.map(id, {
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

    fetchRouteToMap(): void {
        const waypoints = this.getRoutePoints(this.rideRequest!).map(p => L.latLng(p.latitude, p.longitude));
        let route = L.Routing.control({
            waypoints: waypoints,
            collapsible: true,
            fitSelectedRoutes: true,
            routeWhileDragging: false,
            plan: L.Routing.plan(waypoints, {draggableWaypoints: false, addWaypoints: false}),
            lineOptions:
            {
                missingRouteTolerance: 999, // TODO: ???
                extendToWaypoints: true,
                addWaypoints: false
            }
        });
        route.addTo(this.map);
        route.hide();
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-graybg";
    }

    rejectRide(request: RideRequest) {
        if (this.rejectFormGroup.valid) {
            console.log("Send rejection REST call");
            this.rideRequest = null;
            this.map = null;
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

    pullNewRideRequest() {
        // TODO: Get driver ID from session.
        let path: string = 'api/ride/driver/' + 1 + '/ride-requests';

        const obs: Observable<RideRequest> = this.httpClient.get<RideRequest>(environment.serverOrigin + path, {
            observe: "body",
            responseType: "json",
        });

        obs.subscribe((receivedData: RideRequest) => {
            if (receivedData !== null && this.rideRequest === null) {
                this.rideRequest = receivedData;

                if (this.map == null) {
                    console.log("Fetch new map data!");

                    const mapId = "map";
                    waitForElement("#" + mapId).then(e => {
                        this.initMap(mapId);
                        this.fetchRouteToMap();
                    });
                }
            }
        });

    }
}
