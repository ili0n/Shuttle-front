import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { AuthService } from 'src/app/auth/auth.service';
import { PassengerWithRideReview } from 'src/app/driver/driver-history/driver-history.component';
import { DriverService } from 'src/app/driver/driver.service';
import { RideOrderAgain } from 'src/app/passenger/passenger-history/passenger-history.component';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { ReviewPairDTO, ReviewService } from 'src/app/review/review.service';
import { Ride, RideListDTO, RideStatus } from 'src/app/ride/ride.service';
import { User } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-admin-history',
  templateUrl: './admin-history.component.html',
  styleUrls: ['./admin-history.component.css']
})
export class AdminHistoryComponent {
    protected dataSource: MatTableDataSource<Ride> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort!: MatSort;

    protected displayedColumns: string[] = ['id', 'route', 'startTime', 'endTime'];
    private selectedRide: Ride | null = null;
    private selectedRideDriver: User | null = null;
    private selectedRideReviews: Array<ReviewPairDTO> = [];
    private selectedRidePassengers: Array<PassengerWithRideReview> = [];
    private map!: L.Map;
    private route: L.Routing.Control | null = null;
    protected ridesTotal: number = 0;
    protected page: number = 0;
    protected count: number = 0;

    protected selectedUser: User | null = null; 
    protected onChangeSelectedUser(user: User) {
        this.selectedUser = user;
    }

    protected onChangeSelectedRide(ride: Ride) {
        this.selectedRide = ride;
        this.onRideSelected(this.selectedRide);
    }

    @ViewChild('leafletMap')
    private mapElement!: ElementRef;
    
    constructor(
        private authService: AuthService,
        private passengerService: PassengerService,
        private driverService: DriverService,
        private router: Router,
        private reviewService: ReviewService,
    ) {}

    ngOnInit(): void {
        this.driverService.getRides(this.authService.getUserId()).subscribe({
            next: (result: RideListDTO) => {
                this.onRidesFetch(result);
                this.ridesTotal = result.totalCount;
            },
            error: (error) => {
                console.log(error);
            }
        });
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

    protected getSelectedRideVehicleType(): string {
        if (this.selectedRide == null) {
            return "";
        }
        return this.selectedRide.vehicleType;
    }

    protected getSelectedRideBaby(): boolean {
        if (this.selectedRide == null) {
            return false;
        }
        return this.selectedRide.babyTransport;       
    }

    protected getSelectedRidePet(): boolean {
        if (this.selectedRide == null) {
            return false;
        }
        return this.selectedRide.petTransport;       
    }
    
    protected getSelectedRideDeparture(): string {
        if (this.selectedRide == null) {
            return "";
        }
        return this.selectedRide.locations[0].departure.address;    
    }

    protected getSelectedRideDestination(): string {
        if (this.selectedRide == null) {
            return "";
        }
        return this.selectedRide.locations.at(-1)!.destination.address;    
    }

    protected getSelectedRideStatus(): string {
        if (this.selectedRide == null) {
            return "";
        }
        return this.selectedRide.status;    
    }

    protected getSelectedRidePassengers(): Array<PassengerWithRideReview> {
        return this.selectedRidePassengers;
    }

    protected isRideRated(): boolean {
        return false;
    }

    protected canRateRide(): boolean {
        if (this.selectedRide == null) {
            return false;
        }
        if (this.selectedRide.status != RideStatus.Finished) {
            return false;
        }
        const dateFinished = new Date(this.selectedRide.endTime);
        const dateNow = new Date();
        const diff = Math.abs(dateNow.getTime() - dateFinished.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 

        return diffDays < 3;
    }

    protected tooLateToRateRide(): boolean {
        return !this.canRateRide() && !this.isRideRated();
    }
    
    private onRidesFetch(rides: RideListDTO) {
        this.dataSource = new MatTableDataSource<Ride>(rides.results);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    protected onPageChange(event: PageEvent) {
        const page: number = event.pageIndex;
        const count: number = event.pageSize;

        this.passengerService.getRides(this.authService.getUserId()).subscribe({
            next: (result: RideListDTO) => {
                this.onRidesFetch(result);
            },
            error: (error) => {
                console.log(error);
            }
        });

        this.page = page;
        this.count = count;
    }

    protected onSortChange(event: Sort): void {
        const field: string = event.active;
        const dir: string = event.direction;

        this.passengerService.getRides(this.authService.getUserId(), field, dir).subscribe({
            next: (result: RideListDTO) => {
                this.onRidesFetch(result);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    private selectFirstRideInPage(): void {
        if (this.hasRides()) {
            this.onRideSelected(this.dataSource.data[0]);
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
        this.fetchReviewsAndThenPassengerData(this.selectedRide);
    }

    private fetchReviewsAndThenPassengerData(ride: Ride): void {
        this.reviewService.findByRide(ride.id).subscribe({
            next: (reviews) => {
                this.selectedRideReviews = reviews;
                this.fetchPassengerData(ride);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    private fetchPassengerData(ride: Ride): void {
        this.selectedRidePassengers = [];
        for (let p of ride.passengers) {
            this.passengerService.findById(p.id).subscribe({
                next: passenger => {
                    const reviews: ReviewPairDTO | undefined = this.selectedRideReviews.find(r => 
                        r.rideReview.passenger.id == passenger.id ||
                        r.vehicleReview.passenger.id == passenger.id
                    );

                    const result: PassengerWithRideReview = {
                        passenger: passenger,
                        reviews: reviews,
                    }

                    this.selectedRidePassengers.push(result);
                }
            });
        }
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
        return this.dataSource.data.length > 0;
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
    
    protected viewRating(): void {
        console.log("viewRating");
    }

    protected leaveRating(): void {
        console.log("leaveRating");
    }

    protected orderAgain(): void {
        if (this.selectedRide == null) {
            return;
        }
        console.log(this.selectedRide);

        const params: RideOrderAgain = {
            baby: this.selectedRide.babyTransport,
            pet: this.selectedRide.petTransport,
            vehicle: this.selectedRide.vehicleType,
            dep: this.selectedRide.locations[0].departure.address,
            dest: this.selectedRide.locations.at(-1)!.destination.address
        }

        this.router.navigate(
            ['passenger/home'],
            { queryParams: params }
        );
    }
}
