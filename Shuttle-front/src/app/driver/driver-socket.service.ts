import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { VehicleLocationDTO } from '../vehicle/vehicle.service';
import { Ride } from '../ride/ride.service';

@Injectable({
  providedIn: 'root'
})
export class DriverSocketService {
    private stompClient: Stomp.Client | undefined = undefined;
    private connectedToSocketSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private connectedToSocketObs = this.connectedToSocketSubject.asObservable();
    private isConnected: boolean = false;

    public isConnectedToSocket(): boolean {
        return this.isConnected;
    }

    public onConnectedToSocket(): Observable<boolean> {
        return this.connectedToSocketObs;
    }

    constructor(private authService: AuthService) { 
        this.connectToSocket('socket');
    }

    ///////////////////////////////////////  API  /////////////////////////////////////////////////

    public subToVehicleLocation(callback: (loc: VehicleLocationDTO) => void): Stomp.Subscription | null {
        const driverId = this.authService.getUserId();

        return this.subscribeToWebSocketTopic(`vehicle/locations/${driverId}`, message => {
            const location: VehicleLocationDTO = JSON.parse(message.body);
            callback(location);
        });
    }

    public subToRide(callback: (ride: Ride) => void): Stomp.Subscription | null {
        const driverId = this.authService.getUserId();

        return this.subscribeToWebSocketTopic(`ride/driver/${driverId}`, message => {
            const ride: Ride = JSON.parse(message.body);
            callback(ride);
        });
    }

    public pingRide(): void {
        const driverId = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/driver/${driverId}`);    
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    private connectToSocket(stompEndpoint: string) {
        let ws = new SockJS(environment.serverOrigin + stompEndpoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = () => {};
        let self = this;
        this.stompClient.connect({}, () => {
            self.connectedToSocketSubject.next(true);
            this.isConnected = true;
        });
    }

    private subscribeToWebSocketTopic(topicName: string, callback: (msg: Stomp.Message) => any): Stomp.Subscription | null {
        if (this.stompClient != undefined) {
            return this.stompClient.subscribe('/' + topicName, callback);
        } else {
            console.error("Cannot subscribe to topic" + topicName + ". Not connected to a websocket!");
            return null;
        }
    }

    private sendMessageToSocket(message: string, socketEndpoint: string) {
        if (this.stompClient != undefined) {
            this.stompClient.send("/shuttle/" + socketEndpoint, {}, message);
        } else {
            console.error("Cannot send message" + message + " to endpoint " + socketEndpoint + ". Not connected to a websocket!");
        }
    }
}
