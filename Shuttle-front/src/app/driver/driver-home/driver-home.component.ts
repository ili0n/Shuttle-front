import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import * as Stomp from 'stompjs';
import 'leaflet-routing-machine';
import { NavbarService } from 'src/app/navbar-module/navbar.service';
import { PanicDTO, Ride, RideService, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { VehicleLocationDTO } from 'src/app/vehicle/vehicle.service';
import { DriverSocketService } from '../driver-socket.service';

@Component({
    selector: 'app-driver-home',
    templateUrl: './driver-home.component.html',
    styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit, AfterViewInit, OnDestroy {
    private iconCarAvailable!: L.Icon;
    private iconCarBusy!: L.Icon;
    private iconLuxAvailable!: L.Icon;
    private iconLuxBusy!: L.Icon;
    private iconVanAvailable!: L.Icon;
    private iconVanBusy!: L.Icon;

    @ViewChild('leafletMap')
    private mapElement!: ElementRef;
    private map!: L.Map;
    private route: L.Routing.Control | null = null;
    private carLayer!: L.LayerGroup;
    private isActive: boolean = true;

    protected ride: Ride | null = null;

    private rideSub: Stomp.Subscription | null = null;
    private locationSub: Stomp.Subscription | null = null;
    private activeSub: Stomp.Subscription | null = null;

    /****************************************** General ******************************************/

    constructor(private navbarService: NavbarService,
                private sharedService: SharedService,
                private rideService: RideService,
                private driverSocketService: DriverSocketService) {                     
    }

    ngOnInit(): void {
        this.driverSocketService.onConnectedToSocket().subscribe({
            next: (val: boolean) => {
                if (val) {
                    this.onConnectedToSocket();
                }
            }
        });

        /*
        When changing components (e.g. through the navbar), the socket connection stays the same,
        since it's made in DriverSocketService's c-tor. But this component doesn't know that, so
        it won't do anything (instead of calling onConnectedToSocket() where all subscriptions are
        made and the backend is pinged to fetch ride data). 
        UPDATE: No need for this if we're using BehaviourSubject instead of Subject.
        */
        // if (this.driverSocketService.isConnectedToSocket()) {
        //     this.onConnectedToSocket();
        // }
    }

    ngOnDestroy(): void {
        this.rideSub?.unsubscribe();
        this.locationSub?.unsubscribe();
        this.activeSub?.unsubscribe();
    }
    
    ngAfterViewInit(): void {
        this.initMap("map");
        this.initMapIcons();
    }

    private onConnectedToSocket(): void {
        if (this.rideSub == null) {
            this.rideSub = this.driverSocketService.subToRide((r: Ride) => {
                this.onFetchRide(r);
            });
        }

        if (this.locationSub == null) {
            this.locationSub = this.driverSocketService.subToVehicleLocation((l : VehicleLocationDTO) => {
                this.onFetchCurrentLocation(l);
            });
        }

        this.driverSocketService.pingRide();
    }

    private subscribeToSocketSubjects(): void {
        // this.navbarService.getVehicleLocation().subscribe({
        //     next: (value: VehicleLocationDTO) => this.onFetchCurrentLocation(value),
        //     error: (error) => console.log(error)
        // });

        // this.navbarService.getRideDriver().subscribe({
        //     next: (value: Ride) => this.onFetchRide(value),
        //     error: (error) => console.log(error)          
        // });

        // this.navbarService.getDriverActiveFromOutsideState().subscribe({
        //     next: (value: boolean) => {
        //         //console.log("driver-home-component :: ", value);
        //         this.isActive = value;
        //         if (this.isActive) {
        //             this.navbarService.driverRequestToFetchRide();
        //         }
        //     }
        // });
    }

    /******************************************** Map ********************************************/

    private initMap(id: string): void {
        this.map = L.map(this.mapElement.nativeElement, {center: [45.2396, 19.8227], zoom: 13 });
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18, minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);
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

    private onFetchCurrentLocation(vehicle: VehicleLocationDTO): void {
        const loc: L.LatLng = new L.LatLng(vehicle.location.latitude, vehicle.location.longitude);

        if (this.map.getBounds().contains(loc)) {
            this.map.flyTo(loc);
        }
        this.drawMarker(vehicle);
    }

    private drawMarker(vehicle: VehicleLocationDTO) {
        const icon_map = [
            [this.iconCarAvailable, this.iconLuxAvailable, this.iconVanAvailable],
            [this.iconCarBusy, this.iconLuxBusy, this.iconVanBusy],
        ];
        const ico = icon_map[vehicle.available ? 0 : 1][vehicle.vehicleTypeId - 1]; 
        const marker: L.Marker = L.marker(
            [vehicle.location.latitude, vehicle.location.longitude],
            {icon: ico}
        );
        
        if (this.map.hasLayer(this.carLayer)) {
            this.map.removeLayer(this.carLayer);
        }
        this.carLayer = new L.LayerGroup([marker]);
        this.map.addLayer(this.carLayer);
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

    private clearRoute(): void {
        if (this.route != null) {
            this.map?.removeControl(this.route);
        }
        this.route = null;
    }

    private hasRouteOnMap(): boolean {
        return this.route != null;
    }

    /******************************************** Ride********************************************/

    private onFetchRide(ride: Ride): void {
        // If you're not active, ignore the ride. Once you become active, driverRequestToFetchRide()
        // will be fired.

        if (!this.isActive) {
            this.ride = null;
            this.clearRoute();
        }

        // If the ride is cancelled/withdrawn/completed -> set this.ride to null.
        // Because we want to see the right panel ONLY for pending/active/started rides.

        else if ([RideStatus.Canceled, RideStatus.Rejected, RideStatus.Finished].includes(ride.status)) {
            this.ride = null;
            this.clearRoute();
        } 
            
        // If the current ride is Accepted/Started, ignore upcoming ride (which can only be Pending).
        // The reason for this is that we don't want to bother the driver while he's working. Once
        // he finishes the current ride, he'll ask the backend to fetch again, and then he'll get
        // the other ride.

        else {
            // If upstream ride has a weaker status than the current ride, ignore it (for now, it'll
            // come back later).

            let m: any = {};
            m[RideStatus.Pending] = 0;
            m[RideStatus.Accepted] = 1;
            m[RideStatus.Started] = 2;

            if (this.ride != null && m[ride.status] <= m[this.ride.status]) {
                // Ignore.
            } else {
                this.ride = ride;

                // If no route for this ride, draw it now.
                if (!this.hasRouteOnMap()) {
                    const A = this.ride.locations[0].departure;
                    const B = this.ride.locations.at(-1)!.destination;
    
                    const pointA = L.latLng(A.latitude, A.longitude);
                    const pointB = L.latLng(B.latitude, B.longitude);
    
                    this.drawRoute(pointA, pointB);
                }
            }
        }

        this.afterFetchRide();
    }

    private afterFetchRide(): void {
        if (this.ride == null) {
            this.navbarService.setCanDriverChangeActiveState(true);
            return;
        }

        if (/*this.ride.status == RideStatus.Accepted || When he accepts, it doesn't matter what the status is.*/
            this.ride.status == RideStatus.Started) {
            this.navbarService.setCanDriverChangeActiveState(false);
            this.navbarService.setDriverActiveFromDriverState(true);
        } else {
            this.navbarService.setCanDriverChangeActiveState(true);
            //this.navbarService.driverRequestToFetchRide();
        }
    }

    protected hasCurrentRide(): boolean {
        return this.ride != null;
    }

    protected onRideAccept(): void {
        if (!this.ride) {
            return;
        }
   
        this.rideService.accept(this.ride.id).subscribe({
            next: (ride: Ride) => {
                this.sharedService.showSnackBar("Ride accepted.", 3000);
                this.onFetchRide(ride);
            },
            error: (error) => this.sharedService.showSnackBar("Cannot accept ride.", 3000)
        });
    }

    protected onRideStart(): void {
        if (!this.ride) {
            return;
        }
   
        this.rideService.start(this.ride.id).subscribe({
            next: (ride: Ride) => {
                this.sharedService.showSnackBar("Ride started.", 3000);
                this.onFetchRide(ride);
            },
            error: (error) => this.sharedService.showSnackBar("Cannot start ride.", 3000)
        });
    }

    protected onRideFinish(): void {
        if (!this.ride) {
            return;
        }
   
        this.rideService.end(this.ride.id).subscribe({
            next: (ride: Ride) => {
                this.sharedService.showSnackBar("Ride finished.", 3000);
                this.onFetchRide(ride);
            },
            error: (error) => this.sharedService.showSnackBar("Cannot finish ride.", 3000)
        });
    }

    protected onRideReject(reason: string): void {
        if (!this.ride) {
            return;
        }
   
        this.rideService.reject(this.ride.id, reason).subscribe({
            next: (ride: Ride) => {
                this.sharedService.showSnackBar("Ride rejected.", 3000);
                this.onFetchRide(ride);
            },
            error: (error) => this.sharedService.showSnackBar("Cannot reject ride.", 3000)
        });
    }
    
    protected onRidePanic(reason: string): void {
        if (!this.ride) {
            return;
        }
   
        this.rideService.panic(this.ride.id, reason).subscribe({
            next: (panicDTO: PanicDTO) => {
                this.sharedService.showSnackBar("Ride aborted. The staff has been notified", 3000);
                this.onFetchRide(panicDTO.ride);
            },
            error: (error) => this.sharedService.showSnackBar("Cannot panic ride.", 3000)
        });
    }
}
