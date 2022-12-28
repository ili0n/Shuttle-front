import {AfterViewInit, Component} from '@angular/core';
import {DriverRideHistoryService, Ride} from "./driver-ride-history.service";
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
    selector: 'app-driver-ride-history',
    templateUrl: './driver-ride-history.component.html',
    styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent implements AfterViewInit {

    private map: any;

    constructor(private rideHistoryService: DriverRideHistoryService) {
    }



    ngAfterViewInit(): void {
        let DefaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        this.initMap();
    }

    rides: Ride[] | undefined

    drawRoute(event: Event) {
        let id = (event.currentTarget as HTMLInputElement).id;
        // @ts-ignore
        for (let i = 0; i < this.rides?.length; i++) {
            // @ts-ignore
            if (id == this.rides[i].id){
                if (this.rides) {
                    this.addRoute(this.rides[i].route.locations[0].latitude, this.rides[i].route.locations[0].longitude, this.rides[i].route.locations[1].latitude, this.rides[i].route.locations[1].longitude);
                    break;
                }
            }
        }
    }

    getCards() {
        this.rideHistoryService.getAll().subscribe((value) => {
            console.log(value);
            this.rides = value.results;
        });

    }

    initMap(): void {
        this.map = L.map("map", {
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
        L.Routing.control({
            waypoints: [L.latLng(startLat, startLng), L.latLng(endLat, endLng)],
        }).addTo(this.map);
    }
}


