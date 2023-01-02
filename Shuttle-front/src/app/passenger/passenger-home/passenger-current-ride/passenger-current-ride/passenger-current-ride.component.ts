import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DriverService } from 'src/app/driver/driver.service';
import { NavbarService } from 'src/app/navbar-module/navbar.service';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { UserIdEmail } from 'src/app/user/user.service';
import { Location, Vehicle, VehicleLocationDTO } from 'src/app/vehicle/vehicle.service';

@Component({
  selector: 'app-passenger-current-ride',
  templateUrl: './passenger-current-ride.component.html',
  styleUrls: ['./passenger-current-ride.component.css']
})
export class PassengerCurrentRideComponent implements OnInit {
    @Input() ride!: Ride;
    @Input() routeDistance!: number;
    @Input() isRouteFound!: boolean;
    @Input() otherPassengers!: Array<UserIdEmail>;

    protected timeUntilDriverArrives: string = "";
    protected myEmail!: string;
    private vehicleID: number = -1;

    constructor(private authService: AuthService,
                private driverService: DriverService,
                private navbarService: NavbarService) {

    }

    ngOnInit(): void {
        this.myEmail = this.authService.getUserEmail();
        this.subscribeToSocketSubjects();

        this.driverService.getVehicle(this.ride.driver.id).subscribe({
            next: (vehicle: Vehicle) => {
                this.vehicleID = vehicle.id!;
            }
        });
    }

    protected getAddressList(): Array<string> {
        let result: Array<string> = [];
        for (let loc of this.ride.locations) {
            result.push(loc.departure.address);
        }
        result.push(this.ride.locations.at(-1)!.destination.address);

        return result;
    }

    protected getRouteDistanceStr(): string {
        if (this.routeDistance > 1000) {
            return (this.routeDistance / 1000.0).toFixed(2) + "km";
        } else {
            return this.routeDistance.toFixed(2) + "m"; 
        }
    }

    protected isPending(): boolean {
        return this.ride.status == RideStatus.Pending;
    }

    private subscribeToSocketSubjects(): void {
        this.navbarService.getVehicleLocations().subscribe({
            next: (value: Array<VehicleLocationDTO>) => this.onFetchVehicleLocations(value),
            error: (error) => console.log(error)
        })
    }

    private onFetchVehicleLocations(value: Array<VehicleLocationDTO>): void {
        for (let v of value) {
            if (v.id == this.vehicleID) {
                this.getDriverArrivalTimeEst(v.location);
            }
        }
    }

    private getDriverArrivalTimeEst(loc: Location): void {
        const driverY = loc.latitude;
        const driverX = loc.longitude;

        const startY = this.ride.locations[0].departure.latitude;
        const startX = this.ride.locations[0].departure.longitude;

        const dx = startX - driverX;
        const dy = startY - driverY;

        // [m/s] * [deg/m] = [deg/s].
        const velocity = 60 * 0.00003;
        // [deg]
        const dist = Math.sqrt((dx * dx) + (dy * dy));
        // [s]
        const timeleft = dist / velocity;

        const timeLeftWhole: number = Math.round(timeleft);
        this.timeUntilDriverArrives = timeLeftWhole.toString() + "s";
    }

}
