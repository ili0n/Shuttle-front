import { Component, Input } from '@angular/core';
import { Ride } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-driver-history-ride-details',
  templateUrl: './driver-history-ride-details.component.html',
  styleUrls: ['./driver-history-ride-details.component.css']
})
export class DriverHistoryRideDetailsComponent {
    @Input() public ride: Ride | null = null;

    protected getRideVehicleType(): string {
        if (this.ride == null) {
            return "";
        }
        return this.ride.vehicleType;
    }

    protected getRideBaby(): boolean {
        if (this.ride == null) {
            return false;
        }
        return this.ride.babyTransport;       
    }

    protected getRidePet(): boolean {
        if (this.ride == null) {
            return false;
        }
        return this.ride.petTransport;       
    }
    
    protected getRideDeparture(): string {
        if (this.ride == null) {
            return "";
        }
        return this.ride.locations[0].departure.address;    
    }

    protected getRideDestination(): string {
        if (this.ride == null) {
            return "";
        }
        return this.ride.locations.at(-1)!.destination.address;    
    }

    protected getRideStatus(): string {
        if (this.ride == null) {
            return "";
        }
        return this.ride.status;    
    }
}
