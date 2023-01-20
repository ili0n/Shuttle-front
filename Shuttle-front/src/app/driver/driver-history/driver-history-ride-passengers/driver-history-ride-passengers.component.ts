import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { ReviewPairDTO, ReviewService } from 'src/app/review/review.service';
import { Ride } from 'src/app/ride/ride.service';
import { PassengerWithRideReview } from '../driver-history.component';

@Component({
  selector: 'app-driver-history-ride-passengers',
  templateUrl: './driver-history-ride-passengers.component.html',
  styleUrls: ['./driver-history-ride-passengers.component.css']
})
export class DriverHistoryRidePassengersComponent implements OnChanges {
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
                    const reviews: ReviewPairDTO | undefined = this.reviews.find(r => {
                        if (r.driverReview.passenger != null) {
                            if (r.driverReview.passenger.id == passenger.id) {
                                return true;
                            }
                        }
                        if (r.vehicleReview.passenger != null) {
                            if (r.vehicleReview.passenger.id == passenger.id) {
                                return true;
                            }
                        }
                        return false;
                    });

                    const result: PassengerWithRideReview = {
                        passenger: passenger,
                        reviews: reviews,
                    }

                    this.passengers.push(result);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }

    protected getSelectedRidePassengers(): Array<PassengerWithRideReview> {
        return this.passengers;
    }
}
