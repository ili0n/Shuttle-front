import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { DriverService } from 'src/app/driver/driver.service';
import { NavbarService } from 'src/app/navbar-module/navbar.service';
import { RidePanicDialogComponent } from 'src/app/ride/ride-panic-dialog/ride-panic-dialog.component';
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
    @Output() private panicEvent = new EventEmitter<string>();
    @Output() private cancelEvent = new EventEmitter<void>();

    protected timeUntilDriverArrives: string = "";
    protected myEmail!: string;
    private vehicleID: number = -1;

    constructor(private authService: AuthService,
                private driverService: DriverService,
                private navbarService: NavbarService,
                private dialog: MatDialog) {

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

    protected isAccepted(): boolean {
        return this.ride.status == RideStatus.Accepted;
    }

    protected sendPanic(reason: string): void {
        this.panicEvent.emit(reason);
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

    protected openPanicDialog(): void {
        const dialogRef = this.dialog.open(RidePanicDialogComponent, { data: "" });

        dialogRef.afterClosed().subscribe(reason => {
            if (reason != undefined) {
                if (this.ride != null) {
                    this.sendPanic(reason);
                }
            }
        });
    }

    protected isScheduledForFuture(): boolean {
        return this.ride.status == RideStatus.Pending &&  this.ride.startTime != null;
    }

    protected cancelRide(): void {
        this.cancelEvent.emit();
    }
}
