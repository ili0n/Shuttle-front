import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators } from "@angular/forms";
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
    location: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern("^[\+]?[0-9]+$")]],
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
  },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
  )

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if (this.registerForm.valid) {
			console.log("valid");
		}
    else{
      console.log("false");
    }
  }

}
