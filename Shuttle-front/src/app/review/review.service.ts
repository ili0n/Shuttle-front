import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserIdEmail } from '../user/user.service';

export interface ReviewSendDTO {
    rating: number,
    comment: string,
}

export interface ReviewDTO {
    id: number,
    rating: number,
    comment: string,
    passenger: UserIdEmail,
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
    constructor(private httpClient: HttpClient) { }
    readonly url: string = environment.serverOrigin + 'api/review';

    public findByRide(rideId: number): Observable<Array<ReviewPairDTO>> {
        return this.httpClient.get<Array<ReviewPairDTO>>(`${this.url}/${rideId}`, {
            observe: "body",
            responseType: "json",
        });    
    }

    public leaveReviewDriver(rideId: number, review: ReviewSendDTO): Observable<ReviewDTO> {
        return this.httpClient.post<ReviewDTO>(`${this.url}/${rideId}/driver`, review, {
            observe: "body",
            responseType: "json",
        }); 
    }

    public leaveReviewVehicle(rideId: number, review: ReviewSendDTO): Observable<ReviewDTO> {
        return this.httpClient.post<ReviewDTO>(`${this.url}/${rideId}/vehicle`, review, {
            observe: "body",
            responseType: "json",
        }); 
    }
}
