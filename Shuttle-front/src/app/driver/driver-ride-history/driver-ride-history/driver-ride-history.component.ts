import {Component} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {DriverRideHistoryService, Ride} from "./driver-ride-history.service";

@Component({
    selector: 'app-driver-ride-history',
    templateUrl: './driver-ride-history.component.html',
    styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent {

    constructor(private rideHistoryService: DriverRideHistoryService) {
    }

    // rides = [{
    //     id: "ride1",
    //     price: 1250,
    //     startDate: new Date("07/21/2024"),
    //     departure: {
    //         address: "Bulevar oslobodjenja 46",
    //         "latitude": 45.267136,
    //         "longitude": 19.833549
    //     },
    //     destination: {
    //         address: "Bulevar oslobodjenja 46",
    //         "latitude": 55.267136,
    //         "longitude": 19.833549
    //     },
    // },
    //     {
    //         id: "ride2",
    //         price: 1250,
    //         startDate: new Date("07/21/2024"),
    //         departure: {
    //             address: "Bulevar oslobodjenja 46",
    //             "latitude": 45.267136,
    //             "longitude": 16.833549
    //         },
    //         destination: {
    //             address: "Bulevar oslobodjenja 46",
    //             "latitude": 55.267136,
    //             "longitude": 18.833549
    //         },
    //
    //     },
    //     {
    //         id: "ride3",
    //         price: 1250,
    //         startDate: new Date("07/21/2024"),
    //         departure: {
    //             address: "Bulevar oslobodjenja 46",
    //             "latitude": 45.267136,
    //             "longitude": 22.833549
    //         },
    //         destination: {
    //             address: "Bulevar oslobodjenja 46",
    //             "latitude": 45.267136,
    //             "longitude": 30.833549
    //         },
    //
    //     }]

    rides: Ride[] | undefined

    drawRoute(event: Event) {
        let id = (event.currentTarget as HTMLInputElement).id;
        console.log(id);
    }

    getCards() {
        this.rideHistoryService.getAll().subscribe((value) => {
            console.log(value);
            this.rides = value.results;
        });

    }
}


