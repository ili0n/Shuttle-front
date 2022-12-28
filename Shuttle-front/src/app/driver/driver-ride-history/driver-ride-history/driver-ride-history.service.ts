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

    getAll(): Observable<Response> {
        let params = new HttpParams();
        params = params.set("page", 0);
        params = params.set("size", 2);
        params = params.set("sort", "totalCost");
        params = params.set("from", "2017-07-21T17:32:28Z");
        params = params.set("to", "2024-07-21T17:32:28Z");
        return this.http.get<Response>(environment.serverOrigin + 'api/driver/' + this.authService.getId() + "/ride",{params:params});
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
    driver: Person[],
    passengers: Person[]
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

export interface Person {
    id: number,
    email: string
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

