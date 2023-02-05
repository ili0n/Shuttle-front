import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PassengerWithRideReview } from 'src/app/driver/driver-history/driver-history.component';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { ReviewPairDTO, ReviewService } from 'src/app/review/review.service';
import { Ride } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-admin-history-ride-passengers',
  templateUrl: './admin-history-ride-passengers.component.html',
  styleUrls: ['./admin-history-ride-passengers.component.css']
})
export class AdminHistoryRidePassengersComponent implements OnChanges {
    @Input() public ride: Ride | null = null;
    private passengers: Array<PassengerWithRideReview> = [];
    private reviews: Array<ReviewPairDTO> = [];

    constructor(
        private reviewService: ReviewService,
        private passengerService: PassengerService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ride']) {
            this.fetchReviewsAndThenPassengerData();
        }
    }

    private fetchReviewsAndThenPassengerData(): void {
        if (this.ride == null) {
            this.passengers = [];
            this.reviews = [];
            return;
        }
        this.reviewService.findByRide(this.ride.id).subscribe({
            next: (reviews) => {
                this.reviews = reviews;
                this.fetchPassengerData(this.ride!);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    private fetchPassengerData(ride: Ride): void {
        this.passengers = [];
        for (let p of ride.passengers) {
            this.passengerService.findById(p.id).subscribe({
                next: passenger => {
                    const reviews: ReviewPairDTO | undefined = this.reviews.find(r =>
                        r.driverReview?.passenger.id == passenger.id ||
                        r.vehicleReview?.passenger.id == passenger.id
                    );

                    const result: PassengerWithRideReview = {
                        passenger: passenger,
                        reviews: reviews,
                    }

                    this.passengers.push(result);
                }
            });
        }
    }

    protected getSelectedRidePassengers(): Array<PassengerWithRideReview> {
        return this.passengers;
    }
}
