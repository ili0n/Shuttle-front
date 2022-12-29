import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-passenger-home',
    templateUrl: './passenger-home.component.html',
    styleUrls: ['./passenger-home.component.css']
})
export class PassengerHomeComponent implements OnInit, AfterViewInit {
    private map: any;
    private depPos: L.LatLng | null = null;
    private destPos: L.LatLng | null = null;
    private route: L.Routing.Control | null = null;

    formGroup: FormGroup;
    distance: number = -1;

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {
        this.formGroup = this.formBuilder.group({
            departure: ['', []],
            destination: ['', []],
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    foundRoute(): boolean {
        return this.route != null;
    }

    private initMap(id: string): void {
        this.map = L.map(id, {
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

    onSubmit(): void {
        if (this.formGroup?.valid) {
            console.log(this.formGroup.getRawValue());
        }

        const departureText: string = this.formGroup.getRawValue()['departure'];
        const destinationText: string = this.formGroup.getRawValue()['destination'];

        this.textToLocation(departureText).subscribe({
            next: (result) => {
                this.depPos = L.latLng(result[0].lat, result[0].lon);
                this.textToLocation(destinationText).subscribe({
                    next: (result) => {
                        this.destPos = L.latLng(result[0].lat, result[0].lon);
                        this.drawRoute();
                    },
                    error: () => { this.destPos = null; },
                });
            },
            error: () => { this.depPos = null; },
        });
    }

    private textToLocation(location: string): Observable<any> {
        return this.http.get(
            'https://nominatim.openstreetmap.org/search?format=json&q=' + location
        );
    }

    private locationToText(lat: number, lon: number): Observable<any> {
        return this.http.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
        );
    }

    private drawRoute() {
        if (this.depPos != null && this.destPos != null) {
            const waypoints = [this.depPos, this.destPos];

            if (this.route != null) {
                this.map.removeControl(this.route);
            }

            this.route = L.Routing.control({
                waypoints: waypoints,
                collapsible: true,
                fitSelectedRoutes: false,
                routeWhileDragging: false,
                plan: L.Routing.plan(waypoints, { draggableWaypoints: false, addWaypoints: false }),
                lineOptions:
                {
                    missingRouteTolerance: 0,
                    extendToWaypoints: true,
                    addWaypoints: false
                },
            }).addTo(this.map);
            this.route.hide();

            let self = this;

            this.route.on('routesfound', function(e) {
                let routes = e.routes;
                let summary = routes[0].summary;

                self.distance = summary.totalDistance;
                // Math.round(summary.totalTime % 3600 / 60) + ' minutes'
             });
        }
    }

    metersFormat(meters: number): string {
        if (meters >= 1000) {
            return (meters / 1000).toString() + "km";
        } else {
            return meters.toString() + "m";
        }
    }
}
