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

export interface RideRequest {
    id: number,
    passengers: Array<RideRequestPassenger>,
    locations: Array<RideRequestLocation>,
    babyTransport: boolean,
    petTransport: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class RideService {
    constructor(private httpClient: HttpClient) { }
    readonly url: string = environment.serverOrigin + 'api/ride'

    public reject(rideID: number, reason: string): Observable<any> {
        const rejectionDTO: RejectionDTO = {
            reason: reason,
        };

        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/cancel`, rejectionDTO, options);
    }

    public find(driverId: number): Observable<any> {
        const options: any = { responseType: 'json' };
        return this.httpClient.get<RideRequest>(`${this.url}/driver/${driverId}/active`, options);
    }
}
