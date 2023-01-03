import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Ride } from '../ride/ride.service';
import { VehicleLocationDTO } from '../vehicle/vehicle.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private stompClient: Stomp.Client | undefined;
    private passengerRideSubject: Subject<Ride> = new Subject();
    private driverRideSubject: Subject<Ride> = new Subject();
    private vehicleLocationsSubject: Subject<Array<VehicleLocationDTO>> = new Subject();
    private vehicleLocationSubject: Subject<VehicleLocationDTO> = new Subject();

    private canChangeActiveStateSubject: Subject<boolean> = new Subject();
    private driverActiveStateSubject: Subject<boolean> = new Subject();

    public setCanDriverChangeActiveState(canChange: boolean): void {
        this.canChangeActiveStateSubject.next(canChange);
    }

    public getCanChangeActiveState(): Observable<boolean> {
        return this.canChangeActiveStateSubject.asObservable();
    }

    public setDriverActiveState(active: boolean): void {
        this.driverActiveStateSubject.next(active);
    }

    public getDriverActiveState(): Observable<boolean> {
        return this.driverActiveStateSubject.asObservable();
    }

    getRidePassenger(): Observable<Ride> {
        return this.passengerRideSubject.asObservable();
    }

    getRideDriver(): Observable<Ride> {
        return this.driverRideSubject.asObservable();
    }

    getVehicleLocations(): Observable<Array<VehicleLocationDTO>> {
        return this.vehicleLocationsSubject.asObservable();
    }

    constructor(private authService: AuthService) { 
        this.connectToSocket('socket');
    }

    public getVehicleLocation(): Observable<VehicleLocationDTO> {
        return this.vehicleLocationSubject.asObservable();
    }

    
    ////////////////////////////////// Socket stuff

    /**
     * Connect to a websocket.
     * @param stompEndpoint Name of the endpoint used by Stomp to connect to a websocket.
     * Has to be one of the registered endpoints from `WebSocketConfiguration::registerStompEndpoints()`.
     * Must *not* begin with a `/`.
     */
    private connectToSocket(stompEndpoint: string) {
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
    private disconnectFromSocket() {
        this.stompClient?.disconnect(() => {});
    }
    
    /**
     * Subscribe to a given topic to listen to the messages in the topic.
     * @param topicName Name of the topic, *must not* start with a `/`.
     */
    private subscribeToWebSocketTopic(topicName: string, callback: (msg: Stomp.Message) => any) {
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
    private sendMessageToSocket(message: string, socketEndpoint: string) {
        if (this.stompClient != undefined) {
            this.stompClient.send("/shuttle/" + socketEndpoint, {}, message);
        } else {
            console.error("Cannot send message" + message + " to endpoint " + socketEndpoint + ". Not connected to a websocket!");
        }
    }

    private onConnectToWebSocket() {
        // We'll subscribe to different topics based on user role.

        const isPassenger = this.authService.getRoles().filter(r => r == 'passenger').length != 0;
        const isDriver = this.authService.getRoles().filter(r => r == 'driver').length != 0;
        const isAdmin = this.authService.getRoles().filter(r => r == 'admin').length != 0;

        if (isPassenger) {
            this.onConnectToWebSocketPassenger();
        }

        if (isDriver) {
            this.onConnectToWebSocketDriver();
        }

        if (isAdmin) {
            this.onConnectToWebSocketAdmin();
        }
    }

    private onConnectToWebSocketPassenger() {
        const passengerId: number = this.authService.getUserId();

        // Whenever the backend has a new ride for me.

        this.subscribeToWebSocketTopic(`ride/passenger/${passengerId}`, (message) => {
            let r: Ride = JSON.parse(message.body);
            this.passengerRideSubject.next(r);
        });

        // Whenever the backend sends me new vehicle locations.

        this.subscribeToWebSocketTopic(`vehicle/locations`, (message) => {
            const locations = JSON.parse(message.body);
            this.vehicleLocationsSubject.next(locations);
        });

        // Ask the backend to fetch the latest ride.

        this.passengerRequestToFetchRide();
    }

    private onConnectToWebSocketDriver() {
        const driverId: number = this.authService.getUserId();

        // Whenever the backend has a new ride for me.

        this.subscribeToWebSocketTopic(`ride/driver/${driverId}`, (message) => {
            let r: Ride = JSON.parse(message.body);
            this.driverRideSubject.next(r);
        });

        // Whenever the backend sends me my vehicle location.

        this.subscribeToWebSocketTopic(`vehicle/locations/${driverId}`, (message) => {
            const location = JSON.parse(message.body);
            this.vehicleLocationSubject.next(location);
        });

        // Ask the backend to fetch the latest ride.

        this.driverRequestToFetchRide();
    }

    private onConnectToWebSocketAdmin() {

    }

    public passengerRequestToFetchRide() {
        const isPassenger = this.authService.getRoles().filter(r => r == 'passenger').length != 0;
        if (!isPassenger) {
            return;
        }
        
        const passengerId: number = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/passenger/${passengerId}`);
    }

    public driverRequestToFetchRide() {
        const isDriver = this.authService.getRoles().filter(r => r == 'driver').length != 0;
        if (!isDriver) {
            return;
        }
        
        const driverId: number = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/driver/${driverId}`);    
    }
}
