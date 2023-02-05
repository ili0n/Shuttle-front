import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

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

    history() {
        this.router.navigate(["passenger/history"]);
    }

    favorite() {
        this.router.navigate(["passenger/favorites"]);
    }

    graph() {
        this.router.navigate(["passenger/graph"]);
    }

    account() {
        this.router.navigate(["passenger/account"]);
    }
}
