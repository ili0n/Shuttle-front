import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RideListDTO } from '../ride/ride.service';
import { UserIdEmail } from '../user/user.service';


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
    readonly url: string = environment.serverOrigin + 'api/passenger';

    constructor(private httpClient: HttpClient) { }

    public findById(id: number): Observable<Passenger> {

        return this.httpClient.get<Passenger>(`${this.url}/${id}`, {
            observe: "body",
            responseType: "json",
        });
    }

    public findByEmail(email: string): Observable<UserIdEmail> {
        const params = new HttpParams().set('email', email);
        return this.httpClient.get<UserIdEmail>(`${this.url}/email`, {
            params: params,
            observe: "body",
            responseType: "json",
        });
    }

    public getRides(passengerId: number): Observable<RideListDTO> {
        return this.httpClient.get<RideListDTO>(`${this.url}/${passengerId}/ride`, {
            observe: "body",
            responseType: "json"
        });
    }
}
