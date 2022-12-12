import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
    /*
        This component can only be entered from a link.
        With the link should come some encrypted key from
        which we fetch the user's email and let him actually
        change the password. Otherwise, show him that the
        link has expired.
    */

    formGroup: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private router: Router) {
        this.formGroup = formBuilder.group({
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    getUserEmail(): string {
        return "person@example.org";
    }

    resetLinkExpired(): boolean {
        return false;
    }

    ngOnInit() {
        document.body.className = "body-gradient1"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    updateNewPassword() {
        if (this.formGroup.valid) {
            let password = this.formGroup.getRawValue()['password'];
            console.log("Update user " + this.getUserEmail() + " with new password " + password);

            this.router.navigate(["/login"]);
        }
    }
}
