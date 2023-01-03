import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

export interface Location{
    latitude: number,
    longitude: number
}

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    constructor(private httpClient: HttpClient, ) { }

    public add(driver: Driver): Observable<any> {
        const options: any = {
            responseType: 'json'
        };
        return this.httpClient.post(environment.serverOrigin + 'api/driver', driver, options);
    }
}
