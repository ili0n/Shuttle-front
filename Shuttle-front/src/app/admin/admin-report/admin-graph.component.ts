import {Component} from '@angular/core';
import {User} from "../../services/register/register.service";
import {UserRole} from "../../passenger/passenger.service";
import {getGraphData, RideService} from "../../ride/ride.service";

@Component({
    selector: 'app-admin-report',
    templateUrl: './admin-graph.component.html',
    styleUrls: ['./admin-graph.component.css']
})
export class AdminGraphComponent {
    constructor(private rideService: RideService) {
    }

    protected getDataFunc: getGraphData | undefined;
    selectedUser: UserRole | undefined;
    costSumLabel = "Money";
    numberOfRidesLabel = "Number of rides";
    lengthLabel = "Length in km";

    protected onChangeSelectedUser(user: UserRole) {
        this.selectedUser = user;
        if (this.selectedUser) {
            if (this.selectedUser.role.toLowerCase() === "driver")
                this.getDataFunc = this.rideService.getDriverGraphData;
            else if (this.selectedUser.role.toLowerCase() === "passenger") {
                this.getDataFunc = this.rideService.getPassengerGraphData;
            } else this.selectedUser = undefined;
        }
    }
}
