import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Ride } from 'src/app/ride/ride.service';
import { Observable, Subject } from 'rxjs';
import { VehicleLocationDTO } from 'src/app/vehicle/vehicle.service';

@Component({
  selector: 'app-passenger-navbar',
  templateUrl: './passenger-navbar.component.html',
  styleUrls: ['./passenger-navbar.component.css']
})
export class PassengerNavbarComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        
    }

    logout() {
        this.authService.logout();
    }

    home() {
        this.router.navigate(["passenger/home"]);
    }
}
