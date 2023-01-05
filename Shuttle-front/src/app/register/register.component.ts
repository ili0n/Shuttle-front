import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators } from "@angular/forms";
import { RegisterService } from '../services/register/register.service';
import {CustomValidators} from "./confirm.validator"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
    address: ["", [Validators.required]],
    telephoneNumber: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
    profilePicture: new FormControl(null, [Validators.required]),
  },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
  )

  selectedFile?: File;
  selectedFileName?: string; 

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if (this.registerForm.valid) {
      const dataForSubmit = {...this.registerForm.value};
      dataForSubmit.profilePicture = this.selectedFileName;
      // dataForSubmit.picture = this.selectedFile;
      this.registerService.submit(dataForSubmit, this.selectedFile!);
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
     };
    reader.readAsDataURL(this.selectedFile);
    this.selectedFileName = this.selectedFile.name;
    }
  }

}
