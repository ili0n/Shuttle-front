import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import * as Stomp from 'stompjs';
import { DriverService } from 'src/app/driver/driver.service';
import { NavbarService } from 'src/app/navbar-module/navbar.service';
import { RidePanicDialogComponent } from 'src/app/ride/ride-panic-dialog/ride-panic-dialog.component';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { UserIdEmail } from 'src/app/user/user.service';
import { Location, Vehicle, VehicleLocationDTO } from 'src/app/vehicle/vehicle.service';
import { PassengerSocketService } from '../../passenger-socket.service';

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
    @Output() private inconsistencyEvent = new EventEmitter<void>();

    protected elapsedTime: string = "";
    protected timeUntilDriverArrives: string = "";
    protected myEmail!: string;
    private vehicleID: number = -1;
    private timer: NodeJS.Timer | null = null;
    private vehiclesSub: Stomp.Subscription | null = null;

    protected getDriverEmail(): string {
        if (this.ride.driver.email != null) {
            return this.ride.driver.email;
        } else {
            return "No driver assigned yet!"
        }
    }

    constructor(private authService: AuthService,
                private driverService: DriverService,
                private navbarService: NavbarService,
                private dialog: MatDialog,
                private passengerSocketService: PassengerSocketService,) {
        this.startElapsedTimeTimer();
    }

    ngOnInit(): void {
        this.myEmail = this.authService.getUserEmail();

        this.passengerSocketService.onConnectedToSocket().subscribe({
            next: (val: boolean) => {
                if (val) {
                    this.onConnectedToSocket();
                }
            }
        });

        this.driverService.getVehicle(this.ride.driver.id).subscribe({
            next: (vehicle: Vehicle) => {
                console.log("..");
                this.vehicleID = vehicle.id!;
            },
            error: (error) => {
                console.error("WHAT", error);
            }
        });
    }

    private onConnectedToSocket(): void {
        if (this.vehiclesSub == null) {
            this.vehiclesSub = this.passengerSocketService.subToVehicleLocations((l : Array<VehicleLocationDTO>) => {
                this.onFetchVehicleLocations(l);
            });
        }

        this.passengerSocketService.pingRide();
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

    protected isStarted(): boolean {
        return this.ride.status == RideStatus.Started;
    }

    protected sendPanic(reason: string): void {
        this.panicEvent.emit(reason);
    }

    // private subscribeToSocketSubjects(): void {
    //     this.navbarService.getVehicleLocations().subscribe({
    //         next: (value: Array<VehicleLocationDTO>) => this.onFetchVehicleLocations(value),
    //         error: (error) => console.log(error)
    //     })
    // }

    private onFetchVehicleLocations(value: Array<VehicleLocationDTO>): void {
        for (let v of value) {
            //console.log(v.id, this.vehicleID);
            if (v.id == this.vehicleID) {
                //console.log("B");
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
        return this.ride != null && this.ride.scheduledTime != null;
    }

    protected getRideScheduledTime(): string {
        if (this.ride == null ){
            return "";
        }
        return new Date(this.ride.scheduledTime).toLocaleTimeString();
    }

    protected cancelRide(): void {
        this.cancelEvent.emit();
    }

    private getElapsedTime(): string {
        let timeDiffMs: number = Date.now() - new Date(this.ride.startTime).getTime();
        let time: string = new Date(timeDiffMs).toISOString().substring(11, 19);

        if (time.substring(0, 2) == "00") {
            time = time.substring(3, 8);
        }
        return time;
    }

    private startElapsedTimeTimer(): void {
        this.timer = setInterval(() => {
            this.elapsedTime = this.getElapsedTime();
        });
    }

    protected reportInconsistency(): void {
        this.inconsistencyEvent.emit();
    }
}
