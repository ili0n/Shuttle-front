import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PassengerService } from 'src/app/passenger/passenger.service';
import { RidePanicDialogComponent } from 'src/app/ride/ride-panic-dialog/ride-panic-dialog.component';
import { Ride, RideStatus } from 'src/app/ride/ride.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserIdEmailPfp } from 'src/app/user/user.service';
import { RejectRideDialogComponent } from '../../reject-ride-dialog/reject-ride-dialog.component';

@Component({
  selector: 'app-driver-home-current-ride',
  templateUrl: './driver-home-current-ride.component.html',
  styleUrls: ['./driver-home-current-ride.component.css']
})
export class DriverHomeCurrentRideComponent implements OnInit {
    @Input() public ride!: Ride;
    @Output() private acceptEvent = new EventEmitter<void>();
    @Output() private rejectEvent = new EventEmitter<string>();
    @Output() private startEvent = new EventEmitter<void>();
    @Output() private panicEvent = new EventEmitter<string>();
    @Output() private finishEvent = new EventEmitter<void>();

    private timer: NodeJS.Timer | null = null;
    protected elapsedTime: string = "";
    protected usersWithPfp: Array<UserIdEmailPfp> = [];

    public ngOnInit(): void {
        this.fetchUserPfp();
    }

    private fetchUserPfp(): void {
        this.usersWithPfp = [];
        console.log(this.ride.passengers);
        for (let p of this.ride.passengers) {
            console.log(p);
            this.passengerService.findById(p.id).subscribe({
                next: passenger => {
                    this.usersWithPfp.push({
                        id: passenger.id,
                        email:  passenger.email,
                        profilePicture: 'data:image/jpg;base64,' + passenger.profilePicture
                    });
                },
                error: err => {
                    console.log(err);
                    this.sharedService.showSnackBar(`Could not fetch user ${p.id}`, 3000)
                }
            });
        }
    }

    constructor(private dialog: MatDialog, private passengerService: PassengerService, private sharedService: SharedService) {
        this.startElapsedTimeTimer();
    }

    protected getAddressList(): Array<string> {
        let result: Array<string> = [];
        for (let loc of this.ride.locations) {
            result.push(loc.departure.address);
        }
        result.push(this.ride.locations.at(-1)!.destination.address);

        return result;
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

    protected onAcceptClick(): void {
        this.acceptEvent.emit();
    }

    protected onStartClick(): void {
        this.startEvent.emit();
    }

    protected onFinishClick(): void {
        this.finishEvent.emit();       
    }

    protected onRejectClick(): void {
        const dialogRef = this.dialog.open(RejectRideDialogComponent, { data: "" });
        dialogRef.afterClosed().subscribe(reason => {
            if (reason != undefined) {
                this.rejectEvent.emit(reason);
            }
        });      
    }

    protected onPanicClick(): void {
        const dialogRef = this.dialog.open(RidePanicDialogComponent, { data: "" });
        dialogRef.afterClosed().subscribe(reason => {
            if (reason != undefined) {
                this.panicEvent.emit(reason);
            }
        });
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

    protected isScheduledForFuture(): boolean {
        if (this.ride == null) {
            return false;
        }
        return this.ride.scheduledTime != null;
    }

    protected getRideScheduledTime(): string {
        if (this.ride == null ){
            return "";
        }
        return new Date(this.ride.scheduledTime).toLocaleTimeString();
    }
}
