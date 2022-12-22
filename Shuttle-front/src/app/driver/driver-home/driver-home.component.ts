import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, Observable, startWith, Subscription } from 'rxjs';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { SharedService } from 'src/app/shared/shared.service';
import { waitForElement } from 'src/app/util/dom-util';
import { environment } from 'src/environments/environment';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';

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
    private map: any;
    private mapRoute: L.Routing.Control | null = null;
    rideRequest: RideRequest | null = null;
    private pull: Subscription;

    constructor(private readonly formBuilder: FormBuilder, private httpClient: HttpClient, private passengerService: PassengerService, public dialog: MatDialog, private sharedService: SharedService) {
        this.pull = interval(3 * 1000).pipe(startWith(0)).subscribe(r => {
            this.pullNewRideRequest();
        });
    }

    initMap(id: string): void {
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

    fetchRouteToMap(): void {
        const waypoints = this.getRoutePoints(this.rideRequest!).map(p => L.latLng(p.latitude, p.longitude));
        this.mapRoute = L.Routing.control({
            waypoints: waypoints,
            collapsible: true,
            fitSelectedRoutes: true,
            routeWhileDragging: false,
            plan: L.Routing.plan(waypoints, { draggableWaypoints: false, addWaypoints: false }),
            lineOptions:
            {
                missingRouteTolerance: 999, // TODO: ???
                extendToWaypoints: true,
                addWaypoints: false
            }
        });
        this.mapRoute.addTo(this.map);
        this.mapRoute.hide();
    }


    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-graybg";
    }

    rejectRide(request: RideRequest, reason: string) {
        console.log("Reject ride, reason: " + reason);
        this.rideRequest = null;

        if (this.mapRoute != null) {
            this.mapRoute.remove();
            this.mapRoute = null;
        }

        this.sharedService.showSnackBar("Ride request rejected.", 4000);
    }

    beginRide(request: RideRequest) {
        console.log("Begin ride.");
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
            if (this.map == null) {
                this.initMap("map");
            }

            if (receivedData !== null && this.rideRequest == null) {
                this.rideRequest = receivedData;

                if (this.map == null || this.mapRoute == null) {
                    console.log("Fetch new map data!");
                    waitForElement("#map").then(e => {

                        this.fetchRouteToMap();
                    });
                }
            }
        });
    }

    openRejectionDialog(): void {
        const dialogRef = this.dialog.open(RejectRideDialogComponent, { data: "" });

        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (this.rideRequest != null) {
                    this.rejectRide(this.rideRequest, result);
                }
            }
        });
    }
}
