import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {PanicDTO, Ride, RideRequestPassenger} from "../../../ride/ride.service";
import * as L from "leaflet";
import {User} from "../../../services/register/register.service";
import {UserIdEmail} from "../../../user/user.service";

@Component({
    selector: 'app-admin-panic-details',
    templateUrl: './admin-panic-details.component.html',
    styleUrls: ['./admin-panic-details.component.css']
})
export class AdminPanicDetailsComponent implements AfterViewInit, OnChanges {
    @Input()
    selectedPanic: PanicDTO | undefined;

    private map!: L.Map;
    private route: L.Routing.Control | null = null;
    passengers = new Array<RideRequestPassenger>();
    driver:UserIdEmail | undefined = undefined ;



    ngAfterViewInit(): void {

        let DefaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        this.initMap();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map = this.map.remove();
        }
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedPanic']) {
            if (this.selectedPanic) {
                this.drawRouteFrom(this.selectedPanic.ride)
                this.passengers = this.selectedPanic.ride.passengers;
                this.driver = this.selectedPanic.ride.driver;
            }

        }
    }

    initMap(): void {
        this.map = L.map("admin-panic-map", {
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

    private clearRoute(): void {
        if (this.route != null) {
            this.map?.removeControl(this.route);
        }
        this.route = null;
    }

    private drawRouteFrom(ride: Ride) {
        const A_loc = ride.locations[0].departure;
        const B_loc = ride.locations.at(-1)!.destination;
        const A: L.LatLng = new L.LatLng(A_loc.latitude, A_loc.longitude);
        const B: L.LatLng = new L.LatLng(B_loc.latitude, B_loc.longitude);
        this.drawRoute(A, B);
    }

    private drawRoute(A: L.LatLng, B: L.LatLng): void {
        this.map.remove();
        this.initMap();
        let waypoints = [A, B]
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

}
