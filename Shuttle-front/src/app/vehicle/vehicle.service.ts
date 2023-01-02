import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// TODO: Move this interface to shared.
export interface Location {
    address: string,
    latitude: number,
    longitude: number,
}

export interface Vehicle {
    id?: number,
    driverId?: number,
    vehicleType: string,
    model: string,
    licenseNumber: string,
    currentLocation?: Location,
    passengerSeats: number,
    babyTransport: boolean,
    petTransport: boolean,
}

export interface VehicleType {
    name: string,
    pricePerKm: number,
};

export interface VehicleLocationDTO {
    id: number,
    location: Location,
    available: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    constructor(private httpClient: HttpClient, ) { }

    public add(vehicle: Vehicle): Observable<any> {
        const options: any = {
            responseType: 'json'
        };
        return this.httpClient.post(environment.serverOrigin + 'api/vehicle', vehicle, options);
    }

    public getTypes(): VehicleType[] {
        return [
            {name: 'Standard', pricePerKm: 5},
            {name: 'Luxury', pricePerKm: 50},
            {name: 'Van', pricePerKm: 10},
        ];
    }

    public getLocations(): Observable<Array<VehicleLocationDTO>> {
        return this.httpClient.get<Array<VehicleLocationDTO>>(environment.serverOrigin + 'api/vehicle/locations', {
            responseType: 'json'
        });
    }
}
