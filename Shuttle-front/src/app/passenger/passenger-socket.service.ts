import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { AuthService } from '../auth/auth.service';
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

    public subToVehicleLocations(callback: (loc: Array<VehicleLocationDTO>) => void): Stomp.Subscription | null {
        return this.subscribeToWebSocketTopic(`vehicle/locations`, message => {
            const location: Array<VehicleLocationDTO> = JSON.parse(message.body);
            callback(location);
        });
    }

    public subToRide(callback: (ride: Ride) => void): Stomp.Subscription | null {
        const passengerId = this.authService.getUserId();

        return this.subscribeToWebSocketTopic(`ride/passenger/${passengerId}`, message => {
            const ride: Ride = JSON.parse(message.body);
            callback(ride);
        });
    }

    public pingRide(): void {
        const passengerId = this.authService.getUserId();
        this.sendMessageToSocket("", `ride/passenger/${passengerId}`);    
    }
}
