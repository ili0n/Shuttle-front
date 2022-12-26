import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, observable, startWith, Subscription } from 'rxjs';
import { Ride, RideRequestSingleLocation, RideService, RideStatus } from 'src/app/ride/ride.service';
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
    State = State;
    state: State = State.JUST_MAP;
    timer: NodeJS.Timer | null = null;
    timerText: string = "";



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

                if (this.ride.status == RideStatus.Accepted) {
                    this.state = State.RIDE_IN_PROGRESS;
                    this.startRideTimer();
                }
            }
        });
    }

    hasRideRequest(): boolean {
        return this.state == State.RIDE_REQUEST;
    }

    hasActiveRide(): boolean {
        return this.state == State.RIDE_IN_PROGRESS;
    }

    startRideTimer() {
        this.timer = setInterval(() => {
            this.timerText = this.getElapsedTime();
        });
    }

    beginRide() {
        const obs = this.rideService.accept(this.ride!.id);
        obs.subscribe({
            next: (response) => {
                this.state = State.RIDE_IN_PROGRESS;

                // We need the start time to measure elapsed time, but the time should be
                // set on the backend. Since the accuracy of elapsed time isn't important
                // (for now), we can set it here. TODO: Reconsider this.
                this.ride!.startTime = new Date().toISOString();
                this.startRideTimer();

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
                this.ride = null;
                console.log(response);
            }, error: (error) => {
                this.sharedService.showSnackBar("Could not cancel the ride.", 4000);
                console.error(error);
            }
        });
    }

    finishRide() {
        const obs = this.rideService.end(this.ride!.id);
        obs.subscribe({
            next: (response) => {
                this.state = State.JUST_MAP;
                this.mapRoute!.remove();

                this.sharedService.showSnackBar("Ride completed.", 4000);
                this.ride = null;
                console.log(response);
            }, error: (error) => {
                this.sharedService.showSnackBar("Could not end the ride.", 4000);
                console.error(error);
            }
        });
    }

    private getElapsedTime(): string {
        let timeDiffMs: number = Date.now() - new Date(this.ride!.startTime).getTime();
        let time: string = new Date(timeDiffMs).toISOString().substr(11, 8);

        if (time.substr(0, 2) == "00") {
            time = time.substr(3, 5);
        }
        return time;
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
