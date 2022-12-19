import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit {


    constructor(private httpClient : HttpClient) {
    }

    ngOnInit(): void {
        this.subscribeToRides();
    }

    subscribeToRides() {
        // TODO: Get driver ID from session.
        let path: string = 'api/ride/driver/' + 1 + '/ride-requests';

        const obs: Observable<Object> = this.httpClient.get(environment.serverOrigin + path, {
            observe: "body",
            responseType: "json",
        });

        obs.subscribe(result => console.log(result));
    }
}
