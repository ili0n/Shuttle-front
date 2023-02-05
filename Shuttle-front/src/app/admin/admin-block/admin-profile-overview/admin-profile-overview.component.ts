import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DriverService} from "../../../driver/driver.service";
import {AuthService} from "../../../auth/auth.service";
import {SharedService} from "../../../shared/shared.service";
import {CustomValidators} from "../../../register/confirm.validator";
import {AdminService} from "../../admin.service";
import {Ride} from "../../../ride/ride.service";
import {UserRole} from "../../../passenger/passenger.service";

@Component({
  selector: 'app-admin-profile-overview',
  templateUrl: './admin-profile-overview.component.html',
  styleUrls: ['./admin-profile-overview.component.css']
})
export class AdminProfileOverviewComponent implements OnInit{
    @Input() public selectedUser: UserRole | undefined = undefined;

    imageBase64: string = "../../assets/pfp_default.png";

    changeForm = this.formBuilder.group({
        address: ["", [Validators.required]],
        telephoneNumber: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
        name: ["", [Validators.required]],
        surname: ["", [Validators.required]],
        email: ["",[Validators.required]]
    }, []);

    constructor(
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.changeForm.disable();
    }
}
