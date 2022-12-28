import { Component, DoCheck, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-unregistered-page',
  templateUrl: './unregistered-page.component.html',
  styleUrls: ['./unregistered-page.component.css']
})
export class UnregisteredPageComponent{

  @Input()
  currentRoute: [String, String] = ["", ""];

  @Input()
  routeLength: number = 0;

  subscribeToListenSubmit($event: [String, String]) { this.currentRoute = $event; }

  subscribeToListenRouteLength($event: number){this.routeLength = $event};

  constructor(){}

}
