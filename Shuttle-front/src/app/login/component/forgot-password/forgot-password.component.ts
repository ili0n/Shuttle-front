import { Component } from '@angular/core';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    myEmail: string = "example@mail.com"; // TODO: Fetch from session.

    sendPasswordResetLink() {
        throw new Error('Method not implemented.');
    }

    ngOnInit() {
        document.body.className = "body-gradient2"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
