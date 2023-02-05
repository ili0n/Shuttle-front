import { Component } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DriverService} from "../../driver/driver.service";
import {AuthService} from "../../auth/auth.service";
import {SharedService} from "../../shared/shared.service";
import {CustomValidators} from "../../register/confirm.validator";
import {PassengerService} from "../passenger.service";

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.css']
})
export class PassengerProfileComponent {
    selectedFile?: File;
    selectedFileName?: string;
    private selectedFileBase64: string = "";

    imageBase64: string = "../../assets/pfp_default.png";

    changeForm = this.formBuilder.group({
        address: ["", [Validators.required]],
        telephoneNumber: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
        name: ["", [Validators.required]],
        surname: ["", [Validators.required]],
        profilePicture: new FormControl(null, []),
    }, []);

    passwordForm = this.formBuilder.group({
            oldPassword: ["", [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]],
            newPassword: ["", [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]],
            confirmPassword: ["", [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]],
        },[]
    );


    ngOnInit(): void {
        this.passengerService.get(+this.authService.getId()).subscribe({
            next: passenger => {
                this.changeForm.controls["address"].setValue(passenger.address);
                this.changeForm.controls["telephoneNumber"].setValue(passenger.telephoneNumber);
                this.changeForm.controls["name"].setValue(passenger.name);
                this.changeForm.controls["surname"].setValue(passenger.surname);
                this.imageBase64 = 'data:image/jpg;base64,' + passenger.profilePicture;
            },
            error: err => this.sharedService.showSnackBar("Failed to retrieve driver", 3000)
        });
    }

    constructor(
        private formBuilder: FormBuilder,
        private passengerService: PassengerService,
        private authService: AuthService,
        private sharedService: SharedService
    ){
        this.passwordForm.addValidators(CustomValidators.MatchValidator('newPassword', 'confirmPassword'))
    }

    onDataSubmit(): void{
        if (this.changeForm.valid) {

            const dataForSubmit = {...this.changeForm.value};
            dataForSubmit.profilePicture = this.selectedFileBase64;
            dataForSubmit.email = this.authService.getUserEmail();
            this.passengerService.changeProfile(dataForSubmit, +this.authService.getId()).subscribe({
                next: result => this.sharedService.showSnackBar("Success", 3000),
                error: err => this.sharedService.showSnackBar("Fail", 3000)
            });
            console.log("valid");
        }
        else{
            console.log("false");
        }
    }

    onPasswordSubmit(): void{
        if (this.passwordForm.valid) {
            this.authService.changePassword(this.passwordForm.value, +this.authService.getId()).subscribe({
                next: result => this.sharedService.showSnackBar("Success", 3000),
                error: err => this.sharedService.showSnackBar("Fail", 3000)
            })
            console.log("valid");
        }
        else{
            console.log("false");
        }
    }

    selectFile(event : any): void{
        const reader = new FileReader();
        this.selectedFile = event.target.files[0];

        if(this.selectedFile !== undefined){
            reader.onloadend = (e) => {
                this.selectedFileBase64 = e.target?.result as string;
                let tokens = this.selectedFileBase64.split(",");
                if(tokens.length >= 2){
                    this.selectedFileBase64 = tokens[1];
                }
            };
            reader.readAsDataURL(this.selectedFile);
            this.selectedFileName = this.selectedFile.name;
        }
    }
}
