import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DriverService } from 'src/app/driver/driver.service';
import { Ride } from 'src/app/ride/ride.service';
import { User } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-admin-history-ride-details',
  templateUrl: './admin-history-ride-details.component.html',
  styleUrls: ['./admin-history-ride-details.component.css']
})
export class AdminHistoryRideDetailsComponent implements OnChanges {
    @Input() public ride: Ride | null = null;
    private driver: User | null = null;

    constructor(
        private driverService: DriverService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ride']) {
            if (this.ride == null) {
                return;
            }
            this.driverService.get(this.ride!.driver.id).subscribe({
                next: (driver) => { this.driver = driver; },
                error: (err) => { console.log(err); },
            })
        }
    }

    protected getRideDriverName(): string {
        if (this.driver == null) {
            return "";
        }
        return this.driver.name + " " + this.driver.surname;
    }

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
