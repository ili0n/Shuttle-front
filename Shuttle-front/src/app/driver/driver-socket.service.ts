import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { AuthService } from '../auth/auth.service';
import { VehicleLocationDTO } from '../vehicle/vehicle.service';
import { Ride } from '../ride/ride.service';
import { SocketService } from '../util/socket-service/socket-service';

@Injectable({
  providedIn: 'root'
})
export class DriverSocketService extends SocketService {
    constructor(private authService: AuthService) { 
        super();
        this.connectToSocket('socket');
    }

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
            //console.log("FETCH");
            const ride: Ride = JSON.parse(message.body);
            callback(ride);
        });
    }

    public pingRide(): void {
        console.log("PING");
        const driverId = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/driver/${driverId}`);    
    }

    public subToIsActive(callback: (isActive: boolean) => void): Stomp.Subscription | null {
        const driverId = this.authService.getUserId();

        return this.subscribeToWebSocketTopic(`driver/active/${driverId}`, message => {
            const isActive: boolean = JSON.parse(message.body);
            callback(isActive);
        });
    }

    public pingIsActive(): void {
        const driverId = this.authService.getUserId();
        this.sendMessageToSocket("", `driver/active/${driverId}`);   
    }
}
