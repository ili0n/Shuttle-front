import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    formGroup: FormGroup;

    onLoginSubmit(): void {
        if (this.formGroup.valid) {
            console.log(this.formGroup.getRawValue());
        }
    }

    constructor(private readonly formBuilder: FormBuilder) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        // HACK: Is there a better way to dynamically change body style from a component?
        document.body.className = "body-gradient1"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
