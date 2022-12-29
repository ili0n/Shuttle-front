import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserIdEmail {
    id: number;
    email: string;
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

    public findByEmail(newEmail: string): Observable<UserIdEmail> {
        return this.httpClient.get<UserIdEmail>(`${this.url}/email/${newEmail}`, {
            observe: "body",
            responseType: "json",
        });
    }
}
