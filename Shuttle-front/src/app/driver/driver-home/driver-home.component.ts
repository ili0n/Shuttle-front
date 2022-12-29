import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, map, startWith, Subscription } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/auth/auth.service';
import { NavbarService } from 'src/app/navbar-module/navbar.service';
import { Ride, RideRequestSingleLocation, RideService, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';
import { RejectRideDialogComponent } from '../reject-ride-dialog/reject-ride-dialog.component';

enum State {
    JUST_MAP,
    RIDE_REQUEST,
    RIDE_IN_PROGRESS,
}

export interface Message {
    message: string,
    fromId: string,
    toId: string,
}

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    private map: any;
    private mapRoute: L.Routing.Control | null = null;
    private pull: Subscription;
    private _state: State = State.JUST_MAP;
    private timer: NodeJS.Timer | null = null;
    State = State;
    ride: Ride | null = null;
    timerText: string = "";

    //////////////////////////

    private stompClient: Stomp.Client | undefined;

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
     *
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
        this.subscribeToWebSocketTopic("ride", (message) => {
            console.log(message);
        });
    }

    //////////////////////////

    SendWorkHoursThing() {
        this.sendMessageToSocket("Hello", "test");
        /// TODO : REMOVE

        const url: string = "/api/driver/{id}/working-hour";
        const id: number = this.authService.getUserId();
        const page: number = 0;
        const size: number = 12;
        const from: string = "2022-12-28T17:09:55";
        const to: string = "2022-12-29T12:00:00";


        let params = new HttpParams().set('page', page).set('size', size).set('from', from).set('to', to);


        const options: any = { responseType: 'json' };
        this.httpClient.get(environment.serverOrigin + `api/driver/${id}/working-hour`, { params: params, observe: "body" }).subscribe({
            next: (value) => {
                console.log(value);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    constructor(
        private httpClient: HttpClient,
        public dialog: MatDialog, private sharedService: SharedService, private rideService: RideService, private navbarService: NavbarService, private userService: UserService, private authService: AuthService) {
        this.pull = interval(8 * 1000).pipe(startWith(0)).subscribe(() => {
            this.pullNewRideRequest();
        });
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-graybg";
        this.connectToSocket('socket');
    }

    private refreshActivitySlider(): void {
        const canToggleActivity = this._state != State.RIDE_IN_PROGRESS;
        this.navbarService.refreshActivitySlider(canToggleActivity);
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    /**
     * Change the state.
     * @param newState The new state.
     */
    private set state(newState: State) {
        this._state = newState;
        this.refreshActivitySlider();
    }

    /**
     * Get the state.
     */
    get state(): State {
        return this._state
    }

    /**
     * Fetch a ride from the backend and draw a route.
     */
    pullNewRideRequest() {
        const driverID = this.authService.getUserId();
        const obs = this.rideService.find(driverID);

        obs.subscribe((receivedData: Ride) => {
            if (receivedData == null) {
                return;
            }

            this.ride = receivedData;

            if (this.mapRoute == null) {
                this.fetchRouteToMap();
            }

            if (this.ride.status == RideStatus.Pending) {
                this.state = State.RIDE_REQUEST;
            } else if (this.ride.status == RideStatus.Accepted) {
                this.state = State.RIDE_IN_PROGRESS;
                this.startRideTimer();
            }
        });
    }

    hasRideRequest(): boolean {
        return this._state == State.RIDE_REQUEST;
    }

    hasActiveRide(): boolean {
        return this._state == State.RIDE_IN_PROGRESS;
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
                this.userService.setActive(this.authService.getUserId()).subscribe({
                    next: (value) => {
                        this.state = State.RIDE_IN_PROGRESS;
                        this.ride!.startTime = new Date().toISOString();
                        this.startRideTimer();
                        this.sharedService.showSnackBar("Ride started.", 4000);
                    }
                });
            },
            error: (error) => {
                this.sharedService.showSnackBar("Could not start the ride.", 4000);
                console.error(error);
            }
        });
    }

    rejectRide(reason: string) {
        const obs = this.rideService.reject(this.ride!.id, reason);
        obs.subscribe({
            next: (response) => {
                this.removeRideFromContext();
                this.sharedService.showSnackBar("Ride request rejected.", 4000);
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
                this.removeRideFromContext();
                this.sharedService.showSnackBar("Ride completed.", 4000);
            }, error: (error) => {
                this.sharedService.showSnackBar("Could not end the ride.", 4000);
                console.error(error);
            }
        });
    }

    private removeRideFromContext() {
        this.state = State.JUST_MAP;
        this.mapRoute!.remove();
        this.ride = null;
    }

    private getElapsedTime(): string {
        if (this.ride) {
            let timeDiffMs: number = Date.now() - new Date(this.ride!.startTime).getTime();
            let time: string = new Date(timeDiffMs).toISOString().substr(11, 8);

            if (time.substr(0, 2) == "00") {
                time = time.substr(3, 5);
            }
            return time;
        }
        return "00:00";
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
