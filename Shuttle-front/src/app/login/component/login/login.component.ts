import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  onLoginSubmit(): void {
    alert(this.email + ' ' + this.password);
  }

  constructor() {
    // HACK: Is there a better way to dynamically change body style from a component?
    document.body.className = "body-gradient1"; // Defined in src/styles.css
  }

  ngOnDestroy() {
    document.body.className = "";
  }
}
