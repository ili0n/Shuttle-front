import {Component, OnInit} from '@angular/core';
import {DriverUpdate} from "../../driver/driver.service";
import {AdminService, ChangeRequest} from "../admin.service";
import {SharedService} from "../../shared/shared.service";

@Component({
  selector: 'app-admin-driver-change-approve',
  templateUrl: './admin-driver-change-approve.component.html',
  styleUrls: ['./admin-driver-change-approve.component.css']
})
export class AdminDriverChangeApproveComponent implements OnInit{
    current: DriverUpdate | undefined;
    request: DriverUpdate | undefined;
    changeRequests: Array<ChangeRequest> = new Array<ChangeRequest>();
    currentRequest: ChangeRequest | undefined;

    constructor(private adminService:AdminService, private sharedService: SharedService) {
    }
    ngOnInit(): void {
        this.adminService.getChangeRequests().subscribe({
            next: (value) =>{this.changeRequests = value;},
            error: (err) => { console.log(err); },
        })
    }

    displayDriver(i: number) {
        this.currentRequest = this.changeRequests[i];
        this.current = this.currentRequest.user;
        this.request = this.currentRequest;
    }

    approve() {
        if (this.currentRequest)
            this.adminService.approveChanges(this.currentRequest.id).subscribe({
                next: (value) =>{this.sharedService.showSnackBar("Approved", 3000);
                    window.location.reload();},
                error: (err) => { console.log(err); },
            });
    }
    reject() {
        if (this.currentRequest)
            this.adminService.rejectChanges(this.currentRequest.id).subscribe({
                next: (value) =>{this.sharedService.showSnackBar("Rejected", 3000);
                    window.location.reload();},
                error: (err) => { console.log(err); },
            });
    }


}
