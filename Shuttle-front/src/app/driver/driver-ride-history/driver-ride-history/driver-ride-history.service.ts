import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class DriverRideHistoryService {

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    getAll(page:number,size:number,sort:string,from: string, to: string): Observable<Response> {
        let params = new HttpParams();
        params = params.set("page", page);
        params = params.set("size", size);
        params = params.set("sort", sort);
        params = params.set("from", from);
        params = params.set("to", to);
        return this.http.get<Response>(environment.serverOrigin + 'api/driver/' + this.authService.getId() + "/ride",{params:params});
    }

    getReviews(id: string): Observable<ReviewRide>{
        return this.http.get<ReviewRide>(environment.serverOrigin + 'api/review/' + id);
    }
}

export interface Response {
    totalCount: number;
    results: Ride[]
}

export interface Ride {
    id: number,
    startTime: Date,
    endTime: Date,
    totalCost: number,
    driver: ReviewPassengerDTO[],
    passengers: ReviewPassengerDTO[]
    estimatedTimeInMinutes: number,
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean,
    rejection: Rejection,
    route: {
        id:number
        locations: Location[]
    }
}


export interface Rejection {
    reason: string
    timeOfRejection: Date

}

export interface Location {
    address: string,
    latitude: number,
    longitude: number
}

export interface ReviewRide {
    vehicleReview: ReviewDTO,
    driverReview: ReviewDTO

}

export interface ReviewDTO {
    id: number,
    rating: number
    comment: string
    passenger: ReviewPassengerDTO
}
export interface ReviewPassengerDTO {
    id: number,
    email: string
}
