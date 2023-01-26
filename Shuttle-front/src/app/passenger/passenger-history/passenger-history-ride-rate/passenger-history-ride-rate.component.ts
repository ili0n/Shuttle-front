import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ReviewPairDTO, ReviewService } from 'src/app/review/review.service';
import { RideRateDialogComponent, ReviewDialogResult } from 'src/app/ride/ride-rate-dialog/ride-rate-dialog.component';
import { FavoriteRouteDTO, Ride, RideService, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { PassengerFavoriteNameDialogComponent } from '../passenger-favorite-name-dialog/passenger-favorite-name-dialog/passenger-favorite-name-dialog.component';
import { RideOrderAgain } from '../passenger-history.component';

@Component({
  selector: 'app-passenger-history-ride-rate',
  templateUrl: './passenger-history-ride-rate.component.html',
  styleUrls: ['./passenger-history-ride-rate.component.css']
})
export class PassengerHistoryRideRateComponent implements OnInit, OnChanges {
    @Input() public ride: Ride | null = null;
    private rideReview: ReviewPairDTO | null = null;

    constructor(
        private router: Router,
        private reviewService: ReviewService,
        private authService: AuthService,
        private dialog: MatDialog,
        private rideService: RideService,
        private sharedService: SharedService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ride']) {
            this.fetchMyReview();
        }
    }

    ngOnInit(): void {}

    private fetchMyReview(): void {
        const myId = this.authService.getUserId();

        this.reviewService.findByRide(this.ride!.id).subscribe({
            next: (allReviews) => {
                const review: ReviewPairDTO | undefined = allReviews.find(
                    rr => rr.driverReview.passenger?.id == myId || rr.vehicleReview.passenger?.id == myId
                );
                if (review) {
                    this.rideReview = review;
                } else {
                    this.rideReview = null;
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    
    protected isRideRated(): boolean {
        return this.rideReview != null;
    }

    protected canRateRide(): boolean {
        if (this.ride == null) {
            return false;
        }
        if (this.ride.status != RideStatus.Finished) {
            return false;
        }
        if (this.isRideRated()) {
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
        const dialogRef = this.dialog.open(RideRateDialogComponent, { 
            data: {
                currentReview: this.rideReview,
                readonly: true,
            }
        });
    }

    protected leaveRating(): void {
        const dialogRef = this.dialog.open(RideRateDialogComponent, { data: "" });
        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                return;
            }
            const reviews: ReviewDialogResult = result;

            const reviewVehicle = reviews.vehicle;
            const reviewDriver = reviews.driver;

            if (reviewVehicle.rating != 0 && reviewDriver.rating != 0) {
                this.reviewService.leaveReviewVehicle(this.ride!.id, reviewVehicle).subscribe({
                    next: () => { 
                        this.reviewService.leaveReviewDriver(this.ride!.id, reviewDriver).subscribe({
                            next: () => { this.fetchMyReview(); }
                        }); 
                    }
                });
            } else {
                if (reviewVehicle.rating != 0) {
                    this.reviewService.leaveReviewVehicle(this.ride!.id, reviewVehicle).subscribe({
                        next: () => { this.fetchMyReview(); }
                    });
                }
    
                if (reviewDriver.rating != 0) {
                    this.reviewService.leaveReviewDriver(this.ride!.id, reviewDriver).subscribe({
                        next: () => { this.fetchMyReview(); }
                    });
                }
            }
        });
    }

    protected orderAgain(): void {
        if (this.ride == null) {
            return;
        }

        const params: RideOrderAgain = {
            baby: this.ride.babyTransport,
            pet: this.ride.petTransport,
            vehicle: this.ride.vehicleType,
            dep: this.ride.locations[0].departure.address,
            dest: this.ride.locations.at(-1)!.destination.address
        }

        this.router.navigate(['passenger/home'], { queryParams: params });
    }

    protected rideIsFavorite(): boolean {
        return false;
    }

    protected addFavoriteRide(): void {
        const dialogRef = this.dialog.open(PassengerFavoriteNameDialogComponent, { width: '450px' });

        dialogRef.afterClosed().subscribe(result =>{
            if(result === null || result === undefined){
                return;
            }
            if(this.ride === null || this.ride === undefined){
                this.sharedService.showSnackBar("You haven't selected any rides", 3000);
                return;
            }
            let favoriteRide: FavoriteRouteDTO = this.rideService.rideToFavoriteRoute(this.ride!, result.name);
            this.rideService.favoriteRouteCreate(favoriteRide).subscribe({
                next: result =>  this.sharedService.showSnackBar("Successfuly added favorite ride", 3000),
                error: err =>  this.sharedService.showSnackBar("Failed to add favorite route", 3000)
            });
        });
    }
}
