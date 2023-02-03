import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../register/confirm.validator';
import { HttpEventType } from '@angular/common/http';
import { DriverService } from '../driver/driver.service';
import { AuthService } from '../auth/auth.service';
import {FloatLabelType} from '@angular/material/form-field';
import { SharedService } from '../shared/shared.service';


@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit{
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
    this.driverService.get(+this.authService.getId()).subscribe({
      next: driver => {
        this.changeForm.controls["address"].setValue(driver.address);
        this.changeForm.controls["telephoneNumber"].setValue(driver.telephoneNumber);
        this.changeForm.controls["name"].setValue(driver.name);
        this.changeForm.controls["surname"].setValue(driver.surname);
        this.imageBase64 = 'data:image/jpg;base64,' + driver.profilePicture;
      },
      error: err => this.sharedService.showSnackBar("Failed to retrieve driver", 3000)
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private sharedService: SharedService
    ){
      this.passwordForm.addValidators(CustomValidators.MatchValidator('newPassword', 'confirmPassword'))
    }

  onDataSubmit(): void{
    if (this.changeForm.valid) {

      const dataForSubmit = {...this.changeForm.value};
      dataForSubmit.profilePicture = this.selectedFileBase64;
      this.driverService.createChangeRequest(dataForSubmit, +this.authService.getId()).subscribe({
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
