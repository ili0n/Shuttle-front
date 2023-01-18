import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from 'src/app/auth/auth.service';
import { DriverService } from 'src/app/driver/driver.service';
import { Ride, RideListDTO } from 'src/app/ride/ride.service';
import { User } from 'src/app/services/register/register.service';
import { UserService } from 'src/app/user/user.service';
import { PassengerService } from '../passenger.service';

@Component({
  selector: 'app-passenger-history',
  templateUrl: './passenger-history.component.html',
  styleUrls: ['./passenger-history.component.css']
})
export class PassengerHistoryComponent implements AfterViewInit, OnDestroy, OnInit {
    protected dataSource: Array<Ride> = [];
    protected displayedColumns: string[] = ['number', 'route', 'startTime', 'endTime'];
    private selectedRide: Ride | null = null;
    private selectedRideDriver: User | null = null;
    private map!: L.Map;
    private route: L.Routing.Control | null = null;

    @ViewChild('leafletMap')
    private mapElement!: ElementRef;
    
    constructor(
        private authService: AuthService,
        private passengerService: PassengerService,
        private driverService: DriverService,
    ) {}

    ngOnInit(): void {
        this.passengerService.getRides(this.authService.getUserId()).subscribe({
            next: (result: RideListDTO) => {
                this.onRidesFetch(result);
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    ngAfterViewInit(): void {
        this.initMap("map");
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map = this.map.remove();
        }
    }

    protected getSelectedRideDriverName(): string {
        if (this.selectedRideDriver == null) {
            return "";
        }
        return this.selectedRideDriver.name + " " + this.selectedRideDriver.surname;
    }
    
    private onRidesFetch(rides: RideListDTO) {
        this.dataSource = rides.results;

        if (this.dataSource.length > 0) {
            this.onRideSelected(this.dataSource[0]);
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
        this.selectedRide = row;
        this.drawRouteFrom(this.selectedRide);
        this.fetchDriverData(this.selectedRide);
    }

    private fetchDriverData(ride: Ride): void {
        this.driverService.get(ride.driver.id).subscribe({
            next: (driver: User) => {
                this.selectedRideDriver = driver;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    protected isSelected(row: Ride): boolean {
        return row.id == this.selectedRide?.id;
    }

    protected hasAnySelected(): boolean {
        return this.selectedRide != null;
    }

    protected hasRides(): boolean {
        return this.dataSource.length > 0;
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
