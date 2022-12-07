import { Attribute, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router){
  }


  ngOnInit(): void {
  }

  loginRoute() {
    this.router.navigate(["/login"]);
  
  }
  registerRoute() {
    this.router.navigate(["/register"]);
  }
  homeRoute(){
    this.router.navigate([""]);
  }
}
