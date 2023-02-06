import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { SharedService } from 'src/app/shared/shared.service';
import {CustomValidators} from "./confirm.validator"
import { RegisterService } from './register.service';



export class SimpleSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]);
  confirmPassword = new FormControl("", [Validators.required]);
  address = new FormControl("", [Validators.required]);
  telephoneNumber = new FormControl("", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]);
  name = new FormControl("", [Validators.required]);
  surname = new FormControl("", [Validators.required]);
  profilePicture = new FormControl("");

  registerForm = this.formBuilder.group({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
    address: this.address,
    telephoneNumber: this.telephoneNumber,
    name: this.name,
    surname: this.surname,
    profilePicture: this.profilePicture
  },
    []
  )

  selectedFile?: File;
  selectedFileName?: string;
  private selectedFileBase64: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private sharedService: SharedService
  ) {
    this.registerForm.setValidators(CustomValidators.MatchValidator('password', 'confirmPassword'))
  }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if( this.isPasswordsMismatch()){
      this.sharedService.showSnackBar("Passwords don't match", 3000);
    }
    if (this.registerForm.valid) {

      const dataForSubmit = {...this.registerForm.value};
      dataForSubmit.profilePicture = this.selectedFileBase64;

      this.registerService.submit(dataForSubmit, this.selectedFile!).subscribe({
        complete: () =>this.sharedService.showSnackBar("Success", 3000),
        error: (e) => {this.sharedService.showSnackBar(e.error.message, 3000);console.log(e)}
    })
			console.log("valid");
		}
    else{
      console.log("false");
    }
  }

  selectFile(event : Event): void{
    let eventSelect : HTMLInputElement = event.target as HTMLInputElement;
    if (!eventSelect.files || !eventSelect.files.length) {
      return;
    }
    const reader = new FileReader();
    this.selectedFile = eventSelect.files[0];

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

// errors
  isPasswordsMismatch(){
    return this.registerForm.hasError("mismatch");
  }

  getEmailError(){
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.email.hasError('email')) {
      return 'You must enter a correct email address';
    }
    return "Invalid";
  }

  getPasswordError(){
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.password.hasError('pattern')) {
      return 'Your password is not strong enough';
    }
    return "Invalid";
  }

  getConfirmPasswordError(){
    if (this.registerForm.hasError("mismatch")) {
      return 'Passwords must match';
    }
    return "Invalid";
  }

  getNameError(){
    if (this.name.hasError("required")) {
      return 'You must enter a value';
    }
    return "Invalid";
  }

  getSurnameError(){
    if (this.surname.hasError("required")) {
      return 'You must enter a value';
    }
    return "Invalid";
  }

  getAddressError(){
    if (this.address.hasError("required")) {
      return 'You must enter a value';
    }
    return "Invalid";
  }


  getPhoneError(){
    if (this.telephoneNumber.hasError("required")) {
      return 'You must enter a value';
    }
    if (this.telephoneNumber.hasError('pattern')) {
      return 'Your must enter valid telephone number';
    }
    return "Invalid";
  }

}
