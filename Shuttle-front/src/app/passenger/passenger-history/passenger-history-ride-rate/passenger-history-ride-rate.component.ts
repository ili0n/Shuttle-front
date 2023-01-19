import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { RideOrderAgain } from '../passenger-history.component';

@Component({
  selector: 'app-passenger-history-ride-rate',
  templateUrl: './passenger-history-ride-rate.component.html',
  styleUrls: ['./passenger-history-ride-rate.component.css']
})
export class PassengerHistoryRideRateComponent {
    @Input() public ride: Ride | null = null;

    constructor(
        private router: Router
    ) {}
    
    protected isRideRated(): boolean {
        return false;
    }

    protected canRateRide(): boolean {
        if (this.ride == null) {
            return false;
        }
        if (this.ride.status != RideStatus.Finished) {
            return false;
        }
        const dateFinished = new Date(this.ride.endTime);
        const dateNow = new Date();
        const diff = Math.abs(dateNow.getTime() - dateFinished.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 

        return diffDays < 3;
    }

    protected tooLateToRateRide(): boolean {
        return !this.canRateRide() && !this.isRideRated();
    }
    protected viewRating(): void {
        console.log("viewRating");
    }

    protected leaveRating(): void {
        console.log("leaveRating");
    }

    protected orderAgain(): void {
        if (this.ride == null) {
            return;
        }
        console.log(this.ride);

        const params: RideOrderAgain = {
            baby: this.ride.babyTransport,
            pet: this.ride.petTransport,
            vehicle: this.ride.vehicleType,
            dep: this.ride.locations[0].departure.address,
            dest: this.ride.locations.at(-1)!.destination.address
        }

        this.router.navigate(
            ['passenger/home'],
            { queryParams: params }
        );
    }

    protected rideIsFavorite(): boolean {
        return false;
    }

    protected toggleRideIsFavorite(): void {

    }
}
