import {AfterViewInit, Component} from '@angular/core';
import {DriverRideHistoryService, ReviewDTO, ReviewRide, Ride} from "./driver-ride-history.service";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {tileLayer} from "leaflet";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'app-driver-ride-history',
    templateUrl: './driver-ride-history.component.html',
    styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent implements AfterViewInit {

    private map: any;

    constructor(private rideHistoryService: DriverRideHistoryService) {
    }

    page = 0;
    size = 10;
    // sort = "startTime";
    // from = "2017-07-21T17:32:28Z";
    // to = "2024-07-21T17:32:28Z";


    ngAfterViewInit(): void {

        let DefaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        this.initMap();
    }

    rides: Ride[] | undefined
    reviews: ReviewDTO[] | undefined


    drawRoute(event: Event) {
        let id = (event.currentTarget as HTMLInputElement).id;
        // @ts-ignore
        for (let i = 0; i < this.rides?.length; i++) {
            // @ts-ignore
            if (id == this.rides[i].id) {
                if (this.rides) {
                    this.addRoute(this.rides[i].route.locations[0].latitude, this.rides[i].route.locations[0].longitude, this.rides[i].route.locations[1].latitude, this.rides[i].route.locations[1].longitude);
                    break;
                }
            }
        }
        this.rideHistoryService.getReviews(id).subscribe((value) => {
            console.log(value.driverReview);
            this.reviews = [value.driverReview, value.vehicleReview]

        });
    }

    showReview(event: Event) {
        let id = (event.currentTarget as HTMLInputElement).id;
        console.log(id);
        this.reviews?.forEach(value => {
            // @ts-ignore
            if (value.id == id) {
                // @ts-ignore
                document.getElementById('reviewText').textContent = value.comment;
            }
        })

    }

    getCards() {
        // @ts-ignore
        this.rideHistoryService.getAll(this.page, this.size, this.selectControl.value, this.range.controls.start.value?.toISOString(), this.range.controls.end.value?.toISOString()).subscribe((value) => {
            this.rides = value.results;
        });

    }

    initMap(): void {
        this.map = L.map("map_route", {
            center: [45.2396, 19.8227],
            zoom: 13,
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
    }

    private addRoute(startLat: number, startLng: number, endLat: number, endLng: number): void {
        this.map.remove();
        this.initMap();
        let waypoints = [L.latLng(startLat, startLng), L.latLng(endLat, endLng)]
        L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            addWaypoints: false,
            collapsible: true,
            fitSelectedRoutes: true,
            plan: L.Routing.plan(waypoints, {draggableWaypoints: false, addWaypoints: false}),
            lineOptions:
                {
                    missingRouteTolerance: 999, // TODO: ???
                    extendToWaypoints: true,
                    addWaypoints: false
                }
        }).addTo(this.map);

    }

    forwardButton() {
        this.page++;
        this.getCards();
    }

    backButton() {
        if (this.page !== 0)
            this.page--;

        this.getCards();
    }

    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });



    sortParams: sortParam [] = [
        {value: 'totalCost', viewValue: 'Price'},
        {value: 'startTime', viewValue: 'Start Date'},
        {value: 'endTime', viewValue: 'End Date'},
    ];
    selectControl = new FormControl<String | null>(null, Validators.required);

}
interface sortParam {
    value: string;
    viewValue: string;
}



