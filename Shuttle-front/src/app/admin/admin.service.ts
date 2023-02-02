import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../services/register/register.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PanicDTO, Ride} from "../ride/ride.service";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private httpClient: HttpClient) {
    }

    public getPanics(page: number): Observable<Array<PanicDTO>> {
        const params = new HttpParams().set('page', page);
        return this.httpClient.get<Array<PanicDTO>>(environment.serverOrigin + "api/panic/all", {
            params: params,
            responseType: 'json'
        });
    }
}


export interface VehicleLocationDTO {
    id: number
    available: boolean
    location: LocationDTO
    licencePlate: string
    panic: boolean
    vehicleType: string
}

export interface LocationDTO {
    latitude: number
    longitude: number
    address: string
}
