import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RideListDTO } from '../ride/ride.service';
import { User } from '../services/register/register.service';
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
    readonly url: string = environment.serverOrigin + 'api/driver';
    constructor(private httpClient: HttpClient,) { }

    public add(driver: Driver): Observable<any> {
        const options: any = {
            responseType: 'json'
        };
        return this.httpClient.post(this.url, driver, options);
    }

    public get(id: number): Observable<User> {
        return this.httpClient.get<User>(`${this.url}/${id}`, {
            responseType: 'json'
        });
    }

    public getActiveDriversLocations(): Observable<Array<Location>> {
        return this.httpClient.get<Array<Location>>(`${this.url}/active`, {
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
        return this.httpClient.get<Vehicle>(`${this.url}/${driverId}/vehicle`, {
            observe: "body",
            responseType: "json",
        });
    }

    public getRides(driverId: number, sort: string | null = null, dir: string | null = null): Observable<RideListDTO> {
        let queryParams = "";
        if (sort != null) {
            if (dir != null && dir == "desc") {
                queryParams = queryParams + "sort=" + sort + ",desc";
            } else {
                queryParams = queryParams + "sort=" + sort;
            }
        }
        return this.httpClient.get<RideListDTO>(`${this.url}/${driverId}/ride?${queryParams}`, {
            observe: "body",
            responseType: "json"
        });
    }
}