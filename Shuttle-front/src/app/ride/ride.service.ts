import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RejectionDTO {
    reason: string
}

export interface RideRequestPassenger {
    id: number,
    email: string,
}

export interface RideRequestSingleLocation {
    address: string,
    latitude: number,
    longitude: number,
}

export interface RideRequestLocation {
    departure: RideRequestSingleLocation,
    destination: RideRequestSingleLocation,
}

export enum RideStatus {
    Pending = "Pending", Accepted = "Accepted", Rejected = "Rejected", Canceled = "Canceled", Finished = "Finished"
}

export interface Ride {
    id: number,
    passengers: Array<RideRequestPassenger>,
    locations: Array<RideRequestLocation>,
    babyTransport: boolean,
    petTransport: boolean,
    status: RideStatus,
    startTime: string,
}

@Injectable({
    providedIn: 'root'
})
export class RideService {
    constructor(private httpClient: HttpClient) { }
    readonly url: string = environment.serverOrigin + 'api/ride'

    public accept(rideID: number): Observable<any> {
        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/accept`, options);
    }

    public reject(rideID: number, reason: string): Observable<any> {
        const rejectionDTO: RejectionDTO = {
            reason: reason,
        };

        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/cancel`, rejectionDTO, options);
    }

    public end(rideID: number): Observable<Ride> {
        return this.httpClient.put<Ride>(`${this.url}/${rideID}/end`, {
            observe: "body",
            responseBody: "json",
        });
    }

    public find(driverId: number): Observable<Ride> {
        return this.httpClient.get<Ride>(`${this.url}/driver/${driverId}/active`, {
            observe: "body",
            responseType: "json",
        });
    }
}
