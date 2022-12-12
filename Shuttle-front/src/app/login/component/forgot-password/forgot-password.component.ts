import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    formGroup: FormGroup;

    constructor(private readonly formBuilder: FormBuilder) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    sendPasswordResetLink() {
        if (this.formGroup.valid) {
            let email = this.formGroup.getRawValue()['email'];
            console.log("Send link to " + email);
        }
    }

    ngOnInit() {
        document.body.className = "body-gradient2"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
