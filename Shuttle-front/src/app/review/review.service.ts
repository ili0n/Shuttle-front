import { Injectable } from '@angular/core';
import { Passenger } from '../passenger/passenger.service';

export interface ReviewDTO {
    id: number,
    rating: number,
    comment: string,
    UserIdEmail: Passenger,
    forDriver: boolean,
}

export interface ReviewPairDTO {
    vehicleReview: ReviewDTO,
    rideReview: ReviewDTO,
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    constructor() { }
}
