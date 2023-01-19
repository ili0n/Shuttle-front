import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as L from 'leaflet';
import { Ride } from 'src/app/ride/ride.service';

export interface RideOrderAgain {
    baby: boolean,
    pet: boolean,
    vehicle: String,
    dep: String,
    dest: String,
}

@Component({
  selector: 'app-passenger-history',
  templateUrl: './passenger-history.component.html',
  styleUrls: ['./passenger-history.component.css']
})
export class PassengerHistoryComponent {
    protected dataSource: MatTableDataSource<Ride> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort!: MatSort;

    protected displayedColumns: string[] = ['id', 'route', 'startTime', 'endTime'];
    protected selectedRide: Ride | null = null;
    private map!: L.Map;
    private route: L.Routing.Control | null = null;
    
    @ViewChild('leafletMap')
    private mapElement!: ElementRef;

    protected onChangeSelectedRide(ride: Ride) {
        this.onRideSelected(ride);
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map = this.map.remove();
        }
    }

    private initMap(id: string): void {
        this.map = L.map(this.mapElement.nativeElement, {center: [45.2396, 19.8227], zoom: 13 });
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18, minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);
    }

    protected getFieldRoute(ride: Ride): string {
        const dep = ride.locations[0].departure.address;
        const dest = ride.locations.at(-1)?.destination.address;
        return dep + " - " + dest;
    }

    protected onRideSelected(row: Ride): void {
        if (this.selectedRide != row) {
            this.selectedRide = row;
            this.drawRouteFrom(this.selectedRide);
        }
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

    private drawRoute(A: L.LatLng, B: L.LatLng) {
        const waypoints = [A, B];

        this.clearRoute();
        this.route = L.Routing.control({
            waypoints: waypoints,
            collapsible: true,
            fitSelectedRoutes: true,
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
    }
}
