import { HttpStatusCode } from "@angular/common/http";
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import * as L from "leaflet";
import { Message, MessageService } from "src/app/message/message.service";
import { NavbarService } from "src/app/navbar-module/navbar.service";
import { ReviewService } from "src/app/review/review.service";
import { ReviewDialogResult, RideRateDialogComponent } from "src/app/ride/ride-rate-dialog/ride-rate-dialog.component";
import { Ride, RideService, RideRequest, RideStatus } from "src/app/ride/ride.service";
import { MapEstimationService } from "src/app/services/map/map-estimation.service";
import { RESTError } from "src/app/shared/rest-error/rest-error";
import { SharedService } from "src/app/shared/shared.service";
import { VehicleLocationDTO } from "src/app/vehicle/vehicle.service";
import { RecalculateRouteDTO } from "./passenger-order-ride/passenger-order-ride.component";

@Component({
    selector: 'app-passenger-home',
    templateUrl: './passenger-home.component.html',
    styleUrls: ['./passenger-home.component.css']
})
export class PassengerHomeComponent implements OnInit, AfterViewInit, OnDestroy {
    /************************************ Map fields *********************************************/

    @ViewChild('leafletMap')
    private mapElement!: ElementRef;
    private map!: L.Map;
    private route: L.Routing.Control | null = null;
    protected depPos!: L.LatLng;
    protected destPos!: L.LatLng;
    private carLayer!: L.LayerGroup;

    private iconCarAvailable!: L.Icon;
    private iconCarBusy!: L.Icon;
    private iconLuxAvailable!: L.Icon;
    private iconLuxBusy!: L.Icon;
    private iconVanAvailable!: L.Icon;
    private iconVanBusy!: L.Icon;

    /************************************ Form fields ********************************************/

    private isLoadingRoute: boolean = false;
    protected routeDistance: number = 0;

    /************************************ Ride fields ********************************************/

    protected ride: Ride | null = null;


    /************************************ General methods ****************************************/

    constructor(private mapService: MapEstimationService,
                private rideService: RideService,
                private sharedService: SharedService,
                private navbarService: NavbarService,
                private messageService: MessageService,
                private dialog: MatDialog,
                private reviewService: ReviewService) {
    }

    ngOnInit(): void {
        this.subscribeToSocketSubjects();
    }

    ngAfterViewInit(): void {
        this.initMap("map");
        this.initMapIcons();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map = this.map.remove();
        }
    }

    /************************************ Form methods *******************************************/

    canOrderRide(): boolean {
        return this.ride == null;
    }

    isRouteRecalculating(): boolean {
        return this.isLoadingRoute;
    }

    isRouteFound(): boolean {
        return this.route != null;
    }

    /************************************ Map methods ********************************************/

    /**
     * Initialize the map.
     * @param id HTML id of the element where the map will be rendered in.
     */
    private initMap(id: string): void {
        this.map = L.map(this.mapElement.nativeElement, {center: [45.2396, 19.8227], zoom: 13 });
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18, minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);
    }
    
    /**
     * 
     * @param data Data containing the text value
     */
    recalculateRoute(data: RecalculateRouteDTO) {
        this.isLoadingRoute = true;

        this.mapService.search(data.departure).subscribe({
            next: (result) => {
                if (result[0]) {
                    this.depPos = L.latLng(result[0].lat, result[0].lon);
                    this.mapService.search(data.destination).subscribe({
                        next: (result) => {
                            if (result[0]) {
                                this.destPos = L.latLng(result[0].lat, result[0].lon);
                                this.onFoundRoute();
                            }
                        }
                    })
                }
            }
        });
    }

    /**
     * Called when a route is found. It's guaranteed that depPos and destPos are valid.
     */
    private onFoundRoute(): void {
        this.drawRoute(this.depPos, this.destPos);
    }

    /**
     * Clear the previous route (if any), draw the route between two points, update distance text.
     * @param A First point.
     * @param B Second point.
     */
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

        let self = this;
    
        this.route.on('routesfound', function (e) {
            let routes = e.routes;
            let summary = routes[0].summary;

            self.routeDistance = summary.totalDistance;
            self.finishLoadingRoute();    
        });
    }

    private finishLoadingRoute(): void {
        this.isLoadingRoute = false;
    }

    /**
     * Clear the route from the map and sets it to null.
     */
    private clearRoute(): void {
        if (this.route != null) {
            this.map?.removeControl(this.route);
        }
        this.route = null;
    }

    private initMapIcons(): void {
        this.iconCarAvailable = L.icon({
            iconUrl: 'assets/ico_car_avail.png',
            iconSize: [32, 32],
        });

        this.iconCarBusy = L.icon({
            iconUrl: 'assets/ico_car_busy.png',
            iconSize: [32, 32],
        });

        this.iconLuxAvailable = L.icon({
            iconUrl: 'assets/ico_luxury_avail.png',
            iconSize: [32, 32],
        });

        this.iconLuxBusy = L.icon({
            iconUrl: 'assets/ico_luxury_busy.png',
            iconSize: [32, 32],
        });

        this.iconVanAvailable = L.icon({
            iconUrl: 'assets/ico_van_avail.png',
            iconSize: [32, 32],
        });

        this.iconVanBusy = L.icon({
            iconUrl: 'assets/ico_van_busy.png',
            iconSize: [32, 32],
        });
    }

    private redrawVehicleMarkers(locations: Array<VehicleLocationDTO>) {
        let markers: Array<L.Marker> = [];

        const icon_map = [
            [this.iconCarAvailable, this.iconLuxAvailable, this.iconVanAvailable],
            [this.iconCarBusy, this.iconLuxBusy, this.iconVanBusy],
        ]
        
        for (let carLocation of locations) {
            // -1 because IDs go from 1.
            const ico = icon_map[carLocation.available ? 0 : 1][carLocation.vehicleTypeId - 1]; 

            markers.push(L.marker(
                [carLocation.location.latitude, carLocation.location.longitude],
                {icon: ico}
            ));
        }

        if (this.map.hasLayer(this.carLayer)) {
            this.map.removeLayer(this.carLayer);
        }
        
        this.carLayer = new L.LayerGroup(markers);
        this.map.addLayer(this.carLayer);
    }

    /************************************ Ride methods *******************************************/

    protected orderRide(data: RideRequest): void {
        this.rideService.request(data).subscribe({
            next: () => {
                this.navbarService.passengerRequestToFetchRide();
            },
            error: (err) => {
                if (err.status == HttpStatusCode.BadRequest) {
                    const error: RESTError = err.error;
                    this.sharedService.showSnackBar(error.message, 3000);
                }
            }
        });
    }

    private subscribeToSocketSubjects(): void {
        this.navbarService.getRidePassenger().subscribe({
            next: (value: Ride) => this.onFetchRide(value),
            error: (error) => console.log(error)
        })

        this.navbarService.getVehicleLocations().subscribe({
            next: (value: Array<VehicleLocationDTO>) => this.onFetchVehicleLocations(value),
            error: (error) => console.log(error)
        })

        this.navbarService.getVehicleArrivedSubject().subscribe({
            next: () => this.onVehicleArrivedAtLocation(),
            error: (error) => console.log(error)
        })
    }

    private onVehicleArrivedAtLocation(): void {
        this.sharedService.showSnackBar("Vehicle is on location.", 3000);
    }

    private onFetchVehicleLocations(locations: Array<VehicleLocationDTO>): void {
        this.redrawVehicleMarkers(locations);
    }

    private onFetchRide(r: Ride): void {
        if (r.status == RideStatus.Pending) {
            if (r.scheduledTime != null) {
                const timeLocalized: string = new Date(r.scheduledTime).toLocaleString();

                this.sharedService.showSnackBar("Reminder: You have a ride scheduled for " + timeLocalized, 3000);
            }
        }

        if ([RideStatus.Pending, RideStatus.Accepted, RideStatus.Started].includes(r.status)) {
            this.ride = r;
            this.recalculateRouteFromRideIfNoneFound();
        } else if ([RideStatus.Canceled, RideStatus.Finished, RideStatus.Rejected].includes(r.status)) {
            this.ride = r; // No need for this since it'll be null by the end of this block, but it
            // makes the code a bit more tidy since it's consistent in using this.ride instead of r.

            if (this.ride.status == RideStatus.Finished) {
                this.promptToRate(this.ride);
            }

            this.ride = null;
            this.clearRoute();
        }
    }

    private recalculateRouteFromRideIfNoneFound() {
        if (!this.isRouteFound() && this.ride != null) {
            this.depPos = new L.LatLng(this.ride.locations[0].departure.latitude, this.ride.locations[0].departure.longitude);
            this.destPos =  new L.LatLng(this.ride.locations.at(-1)!.destination.latitude, this.ride.locations.at(-1)!.destination.longitude);
            this.onFoundRoute();
        }
    }

    private promptToRate(ride: Ride): void {
        const dialogRef = this.dialog.open(RideRateDialogComponent, { data: "" });
        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                return;
            }
            const reviews: ReviewDialogResult = result;

            const reviewVehicle = reviews.vehicle;
            if (reviewVehicle.comment != "" || reviewVehicle.rating != 0) {
                this.reviewService.leaveReviewVehicle(ride.id, reviewVehicle).subscribe({

                });
            }

            const reviewDriver = reviews.driver;
            if (reviewDriver.comment != "" || reviewDriver.rating != 0) {
                this.reviewService.leaveReviewDriver(ride.id, reviewDriver).subscribe({
                    
                });
            }
        });
    }

    /************************************ Current ride screen ************************************/

    protected hasCurrentRide(): boolean {
        return this.ride != null;
    }

    protected panicClick(reason: string) {
        if (this.ride != null) {
            this.rideService.panic(this.ride.id, reason).subscribe({
                next: (value) => {
                    console.log(value);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }

    protected cancelPendingRide() {
        if (this.ride == null) {
            return;
        }

        this.rideService.withdraw(this.ride.id).subscribe({
            next: (value) => {
                this.sharedService.showSnackBar("Ride canceled!", 3000);
            },
            error: (error) => {
                console.log(error);
                this.sharedService.showSnackBar("Cannot cancel ride!", 3000);
            }
        });
    }

    protected reportDriverInconsistency(): void {
        if (this.ride) {
            this.messageService.sendDriverInconsistencyNote(this.ride.id).subscribe({
                next: (msg: Message) => {
                    console.log(msg);
                    this.sharedService.showSnackBar("Note sent!", 3000);
                }
            });
        }
    }
}
