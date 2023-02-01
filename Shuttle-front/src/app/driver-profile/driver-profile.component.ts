import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../register/confirm.validator';
import { HttpEventType } from '@angular/common/http';
import { DriverService } from '../driver/driver.service';
import { AuthService } from '../auth/auth.service';
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

  changeForm = this.formBuilder.group({
    address: ["", [Validators.required]],
    telephoneNumber: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
    profilePicture: new FormControl(null, [Validators.required]),
  }, []);

  passwordForm = this.formBuilder.group({
    oldPassword: ["", [Validators.required]],
    newPassword: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
  },
  [CustomValidators.MatchValidator('password', 'confirmPassword')]
  );
  

  ngOnInit(): void {
   
  }

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private sharedService: SharedService
    ){}

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
    if (this.changeForm.valid) {

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
