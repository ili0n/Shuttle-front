import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Passenger {
    id: number
    name: string,
    surname: string,
    email: string,
    password: string,
}

@Injectable({
    providedIn: 'root'
})
export class PassengerService {
    constructor(private httpClient: HttpClient) { }

    public findById(id: number): Observable<Passenger> {
        return this.httpClient.get<Passenger>(environment.serverOrigin + "api/passenger/" + id, {
            observe: "body",
            responseType: "json",
        });
    }
}
