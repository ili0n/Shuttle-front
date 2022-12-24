import { Component } from '@angular/core';

@Component({
  selector: 'app-passenger-navbar',
  templateUrl: './passenger-navbar.component.html',
  styleUrls: ['./passenger-navbar.component.css']
})
export class PassengerNavbarComponent {
    logout() {
        localStorage.clear();
        window.location.reload();
    }
}
