import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Ride, RideListDTO } from 'src/app/ride/ride.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-driver-history-ride-table',
  templateUrl: './driver-history-ride-table.component.html',
  styleUrls: ['./driver-history-ride-table.component.css']
})
export class DriverHistoryRideTableComponent implements OnInit {
    protected rideDataSource: MatTableDataSource<Ride> = new MatTableDataSource();
    protected rideDisplayedColumns = ["id", "route", "startTime", "endTime"];
    protected ridesTotal: number = 123;

    protected page: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Output() protected selectedRideEvent: EventEmitter<Ride> = new EventEmitter();
    private selectedRide: Ride | null = null;

    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.fetchUserRides();
    }

    protected onRideSelected(ride: Ride): void {
        this.selectedRideEvent.emit(ride);
        this.selectedRide = ride;
    }

    protected isRideSelected(ride: Ride): boolean {
        return this.selectedRide == ride;
    }
    
    protected hasRides(): boolean {
        return true;
    }

    private fetchUserRides(): void {
        this.userService.getRides(this.authService.getUserId()).subscribe({
            next: (rides) => this.onFetchUserRides(rides),
            error: (err) => console.error(err),
        });
    }

    private onFetchUserRides(rides: RideListDTO): void {
        this.rideDataSource = new MatTableDataSource(rides.results);
        this.rideDataSource.paginator = this.paginator;
        this.rideDataSource.sort = this.sort;
    }

    protected getRideRouteString(ride: Ride): string {
        const dep = ride.locations[0].departure.address;
        const dest = ride.locations.at(-1)?.destination.address;
        return dep + " - " + dest;
    }
}
