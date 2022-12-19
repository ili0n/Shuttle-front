import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Passenger, PassengerService } from 'src/app/passenger/passenger.service';
import { environment } from 'src/environments/environment';

interface RideRequestPassenger {
    id: number,
    email: string,
}

interface RideRequestSingleLocation {
    address: string,
    latitude: number,
    longitude: number,
}

interface RideRequestLocation {
    departure: RideRequestSingleLocation,
    destination: RideRequestSingleLocation,
}

interface RideRequest {
    passengers: Array<RideRequestPassenger>,
    locations: Array<RideRequestLocation>,
    babyTransport: boolean,
    petTransport: boolean,
}

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit, OnDestroy {
    requests: Array<RideRequest> = [];

    constructor(private httpClient : HttpClient, private passengerService: PassengerService) {
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    ngOnInit(): void {
        document.body.className = "body-gradient1";
        this.subscribeToRides();
    }

    getRoutePoints(request: RideRequest): Array<RideRequestSingleLocation> {
        let res = request.locations.map(l => l.departure);
        res.push(request.locations[request.locations.length - 1].destination);
        return res;
    }

    subscribeToRides() {
        // TODO: Get driver ID from session.
        let path: string = 'api/ride/driver/' + 1 + '/ride-requests';

        const obs: Observable<Array<RideRequest>> = this.httpClient.get<Array<RideRequest>>(environment.serverOrigin + path, {
            observe: "body",
            responseType: "json",
        });

        obs.subscribe((receivedData: Array<RideRequest>) => this.requests = receivedData);
    }
}
