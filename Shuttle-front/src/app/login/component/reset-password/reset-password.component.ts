import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EqualsValidator } from 'src/app/shared/validators/EqualsValidator';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    /*
        This component can only be entered from a link.
        With the link should come some encrypted key from
        which we fetch the user's email and let him actually
        change the password. Otherwise, show him that the
        link has expired.

        Potential solution: Add key in URL with user e-mail
        and expiration date. Without the key, router redirects
        to login. Check app-routing.module.ts.
    */

    private key: string = "";
    formGroup: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
        this.formGroup = this.formBuilder.group({
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        }, {
            validator: EqualsValidator('password', 'confirmPassword')
        });
    }

    getUserEmail(): string {
        // TODO: Fetch from key.
        return "person@example.org";
    }

    resetLinkExpired(): boolean {
        // TODO: Fetch from key.
        return false;
    }

    decodeKey(): string {
        return window.atob(this.key);
    }

    ngOnInit() {
        document.body.className = "body-gradient1"; // Defined in src/styles.css

        this.route.params.subscribe(params => {
            if (params['key'] != undefined) {
                this.key = params['key'];
                console.log(this.decodeKey());
            } else {
                this.router.navigate(["/login"]);
            }
        });
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
