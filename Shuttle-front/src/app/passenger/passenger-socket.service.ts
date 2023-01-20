import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { SocketService } from '../util/socket-service/socket-service';
import { Ride } from '../ride/ride.service';
import { VehicleLocationDTO } from '../vehicle/vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class PassengerSocketService extends SocketService {
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
            const ride: Ride = JSON.parse(message.body);
            callback(ride);
        });
    }

    public pingRide(): void {
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
