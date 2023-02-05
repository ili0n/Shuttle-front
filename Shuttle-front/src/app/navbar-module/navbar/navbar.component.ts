import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
    role: string | null = null;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.userState$.subscribe((result) => {
            this.role = result;
            console.log(result);
        });
    }
}
