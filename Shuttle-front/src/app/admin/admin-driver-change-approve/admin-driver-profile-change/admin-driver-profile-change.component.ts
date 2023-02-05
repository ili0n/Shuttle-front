import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DriverUpdate} from "../../../driver/driver.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-admin-driver-profile-change',
  templateUrl: './admin-driver-profile-change.component.html',
  styleUrls: ['./admin-driver-profile-change.component.css']
})
export class AdminDriverProfileChangeComponent implements OnInit, OnChanges{
    @Input() public selectedUser: DriverUpdate | undefined = undefined;

    imageBase64: string = "../../assets/pfp_default.png";

    changeForm = this.formBuilder.group({
        address: ["", [Validators.required]],
        telephoneNumber: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
        name: ["", [Validators.required]],
        surname: ["", [Validators.required]],
    }, []);

    constructor(
        private formBuilder: FormBuilder,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedUser']) {
           this.changeForm.disable();
        }
    }


    ngOnInit(): void {
        this.changeForm.disable();
        if (this.selectedUser) {
            this.changeForm.controls["address"].setValue(this.selectedUser.address);
            this.changeForm.controls["name"].setValue(this.selectedUser.name);
            this.changeForm.controls["surname"].setValue(this.selectedUser.surname);
            this.changeForm.controls["telephoneNumber"].setValue(this.selectedUser.telephoneNumber);
        }
    }
}
