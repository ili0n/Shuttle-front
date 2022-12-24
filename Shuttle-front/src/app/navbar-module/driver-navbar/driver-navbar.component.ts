import { Component } from '@angular/core';

@Component({
  selector: 'app-driver-navbar',
  templateUrl: './driver-navbar.component.html',
  styleUrls: ['./driver-navbar.component.css']
})
export class DriverNavbarComponent {

    logout() {
        localStorage.clear();
        window.location.reload();
    }

}
