import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, startWith, Subscription } from 'rxjs';
import { Ride, RideRequestSingleLocation, RideService } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { waitForElement } from 'src/app/util/dom-util';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';

enum State {
    JUST_MAP,
    RIDE_REQUEST,
    RIDE_IN_PROGRESS,
}

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    private map: any;
    private mapRoute: L.Routing.Control | null = null;
    ride: Ride | null = null;
    private pull: Subscription;
    private state: State = State.JUST_MAP;


    constructor(public dialog: MatDialog, private sharedService: SharedService, private rideService: RideService) {
        this.pull = interval(3 * 1000).pipe(startWith(0)).subscribe(() => {
            this.pullNewRideRequest();
        });
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-graybg";
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    pullNewRideRequest() {
        // TODO: Get driver ID from session.
        const driverID = 1;
        const obs = this.rideService.find(driverID);

        obs.subscribe((receivedData: Ride) => {
            if (receivedData == null) {
                return;
            }

            if (this.state == State.JUST_MAP) {
                this.state = State.RIDE_REQUEST;
                this.ride = receivedData;
                this.fetchRouteToMap();
            }
        });
    }

    hasRideRequest(): boolean {
        return this.state == State.RIDE_REQUEST;
    }

    hasActiveRide(): boolean {
        return this.state == State.RIDE_IN_PROGRESS;
    }

    beginRide() {
        const obs = this.rideService.accept(this.ride!.id);
        obs.subscribe({
            next: (response) => {
                this.sharedService.showSnackBar("Ride started.", 4000);
                console.log(response);
            },
            error: (error) => {
                this.sharedService.showSnackBar("Could not start the ride.", 4000);
                console.error(error);
            }
        })
    }

    rejectRide(reason: string) {
        const obs = this.rideService.reject(this.ride!.id, reason);
        obs.subscribe({
            next: (response) => {
                this.state = State.JUST_MAP;

                if (this.mapRoute != null) {
                    this.mapRoute.remove();
                }

                this.sharedService.showSnackBar("Ride request rejected.", 4000);
                console.log(response);
            }, error: (error) => {
                this.sharedService.showSnackBar("Could not cancel the ride.", 4000);
                console.error(error);
            }
        });

    }

    openRejectionDialog(): void {
        const dialogRef = this.dialog.open(RejectRideDialogComponent, { data: "" });

        dialogRef.afterClosed().subscribe(reason => {
            if (reason != undefined) {
                if (this.ride != null) {
                    this.rejectRide(reason);
                }
            }
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
        const waypoints = this.getRoutePoints(this.ride!).map(p => L.latLng(p.latitude, p.longitude));
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

    getRoutePoints(request: Ride): Array<RideRequestSingleLocation> {
        let res = request.locations.map(l => l.departure);
        res.push(request.locations[request.locations.length - 1].destination);
        return res;
    }
}
