import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../driver/driver.service';
import { Passenger } from '../passenger/passenger.service';
import { UserIdEmail } from '../user/user.service';
import { Vehicle } from '../vehicle/vehicle.service';

export type getGraphData = (startDate: string, endDate: string, id: number) => Observable<Array<GraphEntry>>;

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

export interface FavoriteRouteDTO {
    id?: number,
    favoriteName: string,
    locations: Array<RideRequestLocation>,
    passengers: Array<RideRequestPassenger>,
    vehicleType: string,
    babyTransport: boolean,
    petTransport: boolean,
    scheduledTime: string | null,
    distance?: number,
}

export interface GraphEntry {
	time: string;
	numberOfRides: number;
	costSum: number;
	length: number;
}

export interface Message {
    message: string
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
    totalLength?: number,
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

    public favoriteRouteToRideRequest(favoriteRide: FavoriteRouteDTO): RideRequest{
        return {
            "babyTransport": favoriteRide.babyTransport,
            "distance": favoriteRide.distance!,
            "locations": favoriteRide.locations,
            "passengers": favoriteRide.passengers,
            "petTransport": favoriteRide.petTransport,
            "scheduledTime": favoriteRide.scheduledTime,
            "vehicleType": favoriteRide.vehicleType,
        }
    }

    public rideToFavoriteRoute(ride: Ride, favoriteName: string): FavoriteRouteDTO{
        return {
            "babyTransport": ride.babyTransport,
            "distance": ride.totalLength!,
            "locations": ride.locations,
            "passengers": ride.passengers,
            "petTransport": ride.petTransport,
            "scheduledTime": ride.scheduledTime,
            "vehicleType": ride.vehicleType,
            "favoriteName": favoriteName,
        }
    }

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

    public favoriteRouteCreate(payload: FavoriteRouteDTO): Observable<FavoriteRouteDTO> {
        return this.httpClient.post<FavoriteRouteDTO>(`${this.url}/favorites`, payload, {
            observe: 'body',
            responseType: 'json'
        });
    }


    public getFavoriteRides(passengerId: number): Observable<Array<FavoriteRouteDTO>> {
        return this.httpClient.get<Array<FavoriteRouteDTO>>(`${this.url}/favorites/passenger/${passengerId}`, {
            responseType: 'json'
        });
    }

    public deleteFavorite(routeToRemove: FavoriteRouteDTO): Observable<Message> {
        return this.httpClient.delete<Message>(`${this.url}/favorites/${routeToRemove.id}`, {
            responseType: 'json'
        });
    }

    public getPassengerGraphData(from: string, to: string, passengerId: number): Observable<Array<GraphEntry>> {
        return this.httpClient.get<Array<GraphEntry>>(`${this.url}/graph/passenger/${passengerId}`, {
            params: {
                "from": from,
                "to": to
            },
            observe: 'body',
            responseType: 'json'
        });
    }

    public getDriverGraphData(from: string, to: string, driverId: number): Observable<Array<GraphEntry>> {
        return this.httpClient.get<Array<GraphEntry>>(`${this.url}/graph/driver/${driverId}`, {
            params: {
                "from": from,
                "to": to
            },
            observe: 'body',
            responseType: 'json'
        });
    }

    public getOverallGraphData(from: string, to: string): Observable<Array<GraphEntry>> {
        return this.httpClient.get<Array<GraphEntry>>(`${this.url}/graph/admin`, {
            params: {
                "from": from,
                "to": to
            },
            observe: 'body',
            responseType: 'json'
        });
    }
  
}

