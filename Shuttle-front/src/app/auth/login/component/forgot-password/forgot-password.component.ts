import { ResourceLoader } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/register/confirm.validator';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    formGroup: FormGroup;
    codeFormGroup: FormGroup;
    emailPassed: boolean = false;
    id?: number;

    constructor(
        private readonly formBuilder: FormBuilder,
        private router: Router,
        private sharedService: SharedService,
        private authService: AuthService,
        ) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });

        this.codeFormGroup = formBuilder.group({
            code: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            newPasswordConfirm: ['', [Validators.required]],
        })
        this.codeFormGroup.addValidators(CustomValidators.MatchValidator("newPassword", "newPasswordConfirm"));
    }

    sendPasswordResetLink() {
        if (this.formGroup.valid) {
            let email = this.formGroup.getRawValue()['email'];
            

            this.authService.getUserByEmail(email).subscribe({
                next: result => {
                    if(result !== undefined){
                        this.emailPassed = true;
                        this.id = result.id;
                        this.sendPasswordResetLinkReally(result.id)
                    }
                },
                error: err => this.sharedService.showSnackBar("Couldn't send email, check your input", 3000)
            });
        }
    }

    sendPasswordResetLinkReally(id: number) {
        this.authService.sendCode(id).subscribe({
            next: result => {
                this.sharedService.showSnackBar("An e-mail has been sent.", 5000);
            },
            error: err => this.sharedService.showSnackBar("Couldn't send email, check your input", 3000)
        })

    }

    sendPasswordReset() {
        if (this.codeFormGroup.valid) {
            this.authService.resetPassword(this.codeFormGroup.value, this.id!).subscribe({
                next: result =>{
                 this.sharedService.showSnackBar("Successfully changed password", 3000);
                 this.router.navigate(["/login"]);
                },
                error: err => this.sharedService.showSnackBar("Failed to change password", 3000),
            });
        }
    }

    ngOnInit() {
        document.body.className = "body-gradient2"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
