import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../services/register/register.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PanicDTO, Ride} from "../ride/ride.service";
import {ListUserDTO} from "../user/user.service";
import {DriverUpdate} from "../driver/driver.service";

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

    public getNotes(userId: number): Observable<ListNote> {
        return this.httpClient.get<ListNote>(environment.serverOrigin + "api/user/" + userId + "/note", {
            observe: "body",
            responseType: "json",
        });
    }

    public postNote(userId: number, message: string): Observable<Note> {
        return this.httpClient.post<Note>(environment.serverOrigin + "api/user/" + userId + "/note", {message}, {
            observe: "body",
            responseType: "json",
        });
    }
    public blockUser(userId:number): Observable<null>{
        return this.httpClient.put<null>(environment.serverOrigin + "api/user/" + userId + "/block", null, {
            observe: "body",
            responseType: "json",
        });
    }

    public unblockUser(userId:number): Observable<null>{
        return this.httpClient.put<null>(environment.serverOrigin + "api/user/" + userId + "/unblock", null, {
            observe: "body",
            responseType: "json",
        });
    }
    public getChangeRequests():Observable<Array<ChangeRequest>>{
        return this.httpClient.get<Array<ChangeRequest>>(environment.serverOrigin + "api/driver/request",{
            observe: "body",
            responseType: "json",
        })
    }

    public rejectChanges(requestId: number):Observable<null>{
        return this.httpClient.put<null>(environment.serverOrigin + "api/driver/request/" + requestId + "/reject", null, {
            observe: "body",
            responseType: "json",
        });
    }
    public approveChanges(requestId: number):Observable<null>{
        return this.httpClient.put<null>(environment.serverOrigin + "api/driver/request/" + requestId + "/approve", null, {
            observe: "body",
            responseType: "json",
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
    latitude: number;
    longitude: number;
    address: string;
}

export interface Note {
    id: number;
    message: string;
    date: string;
}

export interface ListNote {
    totalCount: number;
    results: Array<Note>;
}

export interface ChangeRequest extends DriverUpdate{
    id: number;
    user: DriverUpdate;

}
