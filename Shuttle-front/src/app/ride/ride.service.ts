import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RejectionDTO {
    reason: string
}

@Injectable({
    providedIn: 'root'
})
export class RideService {
    constructor(private httpClient: HttpClient) { }
    readonly url: string = environment.serverOrigin + 'api/ride'

    public reject(rideID: number, reason: string): Observable<any> {
        const rejectionDTO: RejectionDTO = {
            reason: reason,
        };

        const options: any = { responseType: 'json' };
        return this.httpClient.put(`${this.url}/${rideID}/cancel`, rejectionDTO, options);
    }
}
