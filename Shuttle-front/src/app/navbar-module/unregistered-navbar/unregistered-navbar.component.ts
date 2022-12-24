import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unregistered-navbar',
  templateUrl: './unregistered-navbar.html',
  styleUrls: ['./unregistered-navbar.css']
})
export class UnregisteredNavbarComponent implements OnInit {

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
