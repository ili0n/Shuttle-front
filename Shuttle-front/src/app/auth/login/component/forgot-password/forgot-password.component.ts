import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    formGroup: FormGroup;

    constructor(private readonly formBuilder: FormBuilder, private router: Router, private sharedService: SharedService) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    sendPasswordResetLink() {
        if (this.formGroup.valid) {
            let email = this.formGroup.getRawValue()['email'];

            this.sharedService.showSnackBar("An e-mail has been sent to " + email + ".", 5000);
            this.router.navigate(["/login"]);

            // TODO: Send it.
        }
    }

    ngOnInit() {
        document.body.className = "body-gradient2"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
