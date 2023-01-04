import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehicle } from '../vehicle/vehicle.service';

export interface Driver {
    id?: number,
    name: string,
    surname: string,
    profilePicture: string,
    telephoneNumber: string,
    address: string,
    email: string,
    password: string
}

export interface Location {
    latitude: number,
    longitude: number
}

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    constructor(private httpClient: HttpClient,) { }

    public add(driver: Driver): Observable<any> {
        const options: any = {
            responseType: 'json'
        };
        return this.httpClient.post(environment.serverOrigin + 'api/driver', driver, options);
    }

    public getActiveDriversLocations(): Observable<Array<Location>> {
        return this.httpClient.get<Array<Location>>(environment.serverOrigin + "api/driver/active", {
            observe: "body",
            responseType: "json",
        });
    }

    /**
     * 
     * @param driverId ID of the driver.
     * @returns An observable sending the vehicle of the driver.
     */
    public getVehicle(driverId: number): Observable<Vehicle> {
        return this.httpClient.get<Vehicle>(environment.serverOrigin + `api/driver/${driverId}/vehicle`, {
            observe: "body",
            responseType: "json",
        });
    }
}