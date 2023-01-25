import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../auth/register/confirm.validator';
import { HttpEventType } from '@angular/common/http';
import { DriverProfileUploadService } from '../services/driver-profile-upload.service';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnInit{
  selectedFile?: File;
  selectedFileName?: String = '';

  changeForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    oldPassword: ["", [Validators.required]],
    newPassword: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
    address: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
  },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
  )
  

  ngOnInit(): void {
   
  }

  constructor(
    private formBuilder: FormBuilder,
    private submitService: DriverProfileUploadService
    ){}

  onSubmit(): void{
    console.log("NES");
    
    if(this.selectedFile){
      var formData: FormData = new FormData();

      formData.append("name", this.changeForm.get("name")?.value);
      formData.append("surname", this.changeForm.get("surname")?.value);
      formData.append("email", this.changeForm.get("email")?.value);
      formData.append("address", this.changeForm.get("address")?.value);
      formData.append("phone", this.changeForm.get("phone")?.value);
      formData.append("oldPassword", this.changeForm.get("oldPassword")?.value);
      formData.append("newPassword", this.changeForm.get("newPassword")?.value);
      formData.append("confirmPassword", this.changeForm.get("confirmPassword")?.value);
      formData.append("profileImage", this.changeForm.get("profileImage")?.value);

      this.submitService.submit(formData);
    }
  }

  selectFile(event : any): void{
    const reader = new FileReader();
    // reader.onloadend = () => {
    //   this.userFileInfo = reader.result;
    //   this.imgURL = this.userFileInfo;
    // };
    this.selectedFile = event.target.files[0];
    if(this.selectedFile !== undefined){
      reader.readAsDataURL(this.selectedFile);

      this.selectedFileName = this.selectedFile.name;
    }
  }
}
