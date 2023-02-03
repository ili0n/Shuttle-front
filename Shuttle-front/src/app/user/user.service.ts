import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Passenger, UserRole} from '../passenger/passenger.service';
import { RideListDTO } from '../ride/ride.service';

export interface UserIdEmail {
    id: number;
    email: string;
}

export interface ListUserDTO {
    totalCount: number;
    results: Array<UserRole>; // TODO: Same interface different name.
}

export interface UserIdEmailPfp extends UserIdEmail {
    profilePicture: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly url: string = environment.serverOrigin + 'api/user'
    constructor(private httpClient: HttpClient) { }

    public setActive(id: number): Observable<any> {
        return this.httpClient.put(`${this.url}/${id}/active`, {
            observe: "body",
            responseType: "json",
        });
    }

    public setInactive(id: number): Observable<any> {
        return this.httpClient.put(`${this.url}/${id}/inactive`, {
            observe: "body",
            responseType: "json",
        });
    }

    public getActive(id: number): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.url}/${id}/active`, {
            observe: "body",
            responseType: "json",
        });
    }

    public get(): Observable<ListUserDTO> {
        return this.httpClient.get<ListUserDTO>(`${this.url}/roles`, {
            observe: "body",
            responseType: "json",
        });
    }

    public getRides(userId: number): Observable<RideListDTO> {
        return this.httpClient.get<RideListDTO>(`${this.url}/${userId}/ride`, {
            observe: "body",
            responseType: "json",
        });
    }
}
