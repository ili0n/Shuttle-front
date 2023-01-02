import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../driver/driver.service';
import { UserIdEmail } from '../user/user.service';
import { Vehicle } from '../vehicle/vehicle.service';

export interface RejectionDTO {
    reason: string
}

export interface RejectionTimeDTO {
    reason: string,
    timeOfRejection: string,
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

export interface PanicDTO {
    id: number,
    user: UserIdEmail, // Todo, use different interface
    ride: Ride,
    time: string,
    reason: string
}

export interface Ride {
    id: number,
    passengers: Array<RideRequestPassenger>,
    locations: Array<RideRequestLocation>,
    babyTransport: boolean,
    petTransport: boolean,
    status: RideStatus,
    startTime: string,
    vehicleType: string,
    rejection: RejectionTimeDTO,
    driver: RideRequestPassenger, // TODO: Same fields and field names but it's not a Passenger.
    vehicle: Vehicle,
}

export interface RideRequest {
    locations: Array<RideRequestLocation>,
    passengers: Array<RideRequestPassenger>,
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean,
    hour: string,
    minute: string,
}

@Injectable({
    providedIn: 'root'
})
export class RideService {
    constructor(private httpClient: HttpClient) { }
    readonly url: string = environment.serverOrigin + 'api/ride'

    public request(payload: RideRequest): Observable<RideRequest> {
        return this.httpClient.post<RideRequest>(`${this.url}`, payload, {
            observe: 'body',
            responseType: 'json'
        });
    }

    public accept(rideID: number): Observable<any> {
        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/accept`, options);
    }

    public reject(rideID: number, reason: string): Observable<Ride> {
        const rejectionDTO: RejectionDTO = {
            reason: reason,
        };
        return this.httpClient.put<Ride>(`${this.url}/${rideID}/cancel`, rejectionDTO, {
            responseType: 'json'
        });
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

    public findByPassenger(passengerId: number): Observable<Ride> {
        return this.httpClient.get<Ride>(`${this.url}/passenger/${passengerId}/active`, {
            observe: "body",
            responseType: "json",
        });    
    }

    public panic(rideId: number, reason: string): Observable<PanicDTO> {
        return this.httpClient.put<PanicDTO>(`${this.url}/${rideId}/panic`, reason, {
            responseType: 'json'
        });
    }
}
