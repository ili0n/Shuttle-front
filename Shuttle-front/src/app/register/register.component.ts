import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { RegisterService } from '../services/register/register.service';
import { SnackbarComponent } from '../util/snackbar/snackbar/snackbar.component';
import {CustomValidators} from "./confirm.validator"



export class SimpleSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}

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
  private selectedFileBase64: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    if (this.registerForm.valid) {

      const dataForSubmit = {...this.registerForm.value};
      dataForSubmit.profilePicture = this.selectedFileBase64;

      this.registerService.submit(dataForSubmit, this.selectedFile!).subscribe({
        complete: () => this.openSnackBar(),
        error: (e) => console.error(e),
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

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5 * 1000,
      panelClass: "success-dialog"
    });
  }



}
