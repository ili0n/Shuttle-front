import {Component} from '@angular/core';
import {UserRole} from "../../passenger/passenger.service";
import {AdminService} from "../admin.service";

@Component({
    selector: 'app-admin-block',
    templateUrl: './admin-block.component.html',
    styleUrls: ['./admin-block.component.css']
})
export class AdminBlockComponent {
    selectedUser: UserRole | undefined;

    constructor(private adminService: AdminService) {
    }

    protected onChangeSelectedUser(user: UserRole) {
        this.selectedUser = user;
    }

    blockUser() {
        if (this.selectedUser) {
            this.adminService.blockUser(this.selectedUser.id).subscribe(value => {
                console.log(value);
                if (this.selectedUser)
                    this.selectedUser.blocked = true;
            })
        }
    }

    unblockUser() {
        if (this.selectedUser) {
            this.adminService.unblockUser(this.selectedUser.id).subscribe(value => {
                console.log(value);
                if (this.selectedUser)
                    this.selectedUser.blocked = false;
            })
        }
    }

}
