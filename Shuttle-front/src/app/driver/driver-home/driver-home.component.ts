import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, startWith, Subscription } from 'rxjs';
import { RideRequest, RideRequestSingleLocation, RideService } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { waitForElement } from 'src/app/util/dom-util';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';

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

    constructor(public dialog: MatDialog, private sharedService: SharedService, private rideService: RideService) {
        this.pull = interval(3 * 1000).pipe(startWith(0)).subscribe(() => {
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

    rejectRide(reason: string) {
        const obs = this.rideService.reject(this.rideRequest!.id, reason);
        obs.subscribe({
            next: (response) => {
            if (this.mapRoute != null) {
                this.mapRoute.remove();
                this.mapRoute = null;
            }
            this.rideRequest = null;
            this.sharedService.showSnackBar("Ride request rejected.", 4000);
        }, error: (error) => {
            this.sharedService.showSnackBar("Could not cancel the ride.", 4000);
            console.error(error);
        }});

    }

    beginRide() {
        console.log("Begin ride.");
    }

    getRoutePoints(request: RideRequest): Array<RideRequestSingleLocation> {
        let res = request.locations.map(l => l.departure);
        res.push(request.locations[request.locations.length - 1].destination);
        return res;
    }

    pullNewRideRequest() {
        // TODO: Get driver ID from session.
        const driverID = 1;
        const obs = this.rideService.find(driverID);

        obs.subscribe((receivedData: RideRequest) => {
            if (this.map == null) {
                this.initMap("map");
            }

            if (receivedData !== null && this.rideRequest == null) {
                this.rideRequest = receivedData;

                if (this.map == null || this.mapRoute == null) {
                    console.log("Fetch new map data!");
                    waitForElement("#map").then(() => {

                        this.fetchRouteToMap();
                    });
                }
            }
        });
    }

    openRejectionDialog(): void {
        const dialogRef = this.dialog.open(RejectRideDialogComponent, { data: "" });

        dialogRef.afterClosed().subscribe(reason => {
            if (reason != undefined) {
                if (this.rideRequest != null) {
                    this.rejectRide(reason);
                }
            }
        });
    }
}
