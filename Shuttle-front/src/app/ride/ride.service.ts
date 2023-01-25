import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../driver/driver.service';
import { Passenger } from '../passenger/passenger.service';
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

export interface RideListDTO {
    totalCount: number,
    results: Array<Ride>
}

export interface RouteDTO {
	departure: LocationDTO,
	destination: LocationDTO
}

export interface LocationDTO {
	address: String,
	latitude: number,
	longitude: number
}

export interface BasicUserInfoDTO {
	id: number;
	email: String;
}

export interface FavoriteRouteDTO {
    id: number,
    favoriteName: String,
    locations: Array<RouteDTO>,
    passengers: Array<BasicUserInfoDTO>,
    vehicleType: String,
    babyTransport: boolean,
    petTransport: boolean,
    scheduledTime: String
}



export enum RideStatus {
    Pending = "PENDING", Accepted = "ACCEPTED", Rejected = "REJECTED", Canceled = "CANCELED", Finished = "FINISHED", Started = "STARTED"
}

export interface PanicDTO {
    id: number,
    user: Passenger, // Todo, use different interface
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
    endTime: string,
    vehicleType: string,
    rejection: RejectionTimeDTO,
    driver: UserIdEmail,
    scheduledTime: string,
}

export interface RideRequest {
    locations: Array<RideRequestLocation>,
    passengers: Array<RideRequestPassenger>,
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean,
    scheduledTime: string | null,
    distance: number,
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

    public start(rideID: number): Observable<any> {
        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/start`, options);
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
        return this.httpClient.put<PanicDTO>(`${this.url}/${rideId}/panic`, {reason: reason}, {
            responseType: 'json'
        });
    }

    public withdraw(rideId: number): Observable<Ride> {
        return this.httpClient.put<Ride>(`${this.url}/${rideId}/withdraw`, {
            responseType: 'json'
        });
    }


    public getFavoriteRides(passengerId: number): Observable<Array<FavoriteRouteDTO>> {
        return this.httpClient.get<Array<FavoriteRouteDTO>>(`${this.url}/favorites/passenger/${passengerId}`, {
            responseType: 'json'
        });
      }
}
