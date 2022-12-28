import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { RouteBaseInfo } from '../services/map/map-estimation.service';

@Component({
  selector: 'app-unregistered-page',
  templateUrl: './unregistered-page.component.html',
  styleUrls: ['./unregistered-page.component.css']
})
export class UnregisteredPageComponent{

  @Input()
  currentRoute: [String, String] = ["", ""];

  @Input()
  routeInfo?: RouteBaseInfo;

  subscribeToListenSubmit($event: [String, String]) { this.currentRoute = $event; }

  subscribeToListenRouteLength($event: RouteBaseInfo){this.routeInfo = $event};

  constructor(){}

}
