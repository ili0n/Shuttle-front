import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { MapEstimationService } from '../services/map/map-estimation.service';

@Component({
  selector: 'app-unregistered-page',
  templateUrl: './unregistered-page.component.html',
  styleUrls: ['./unregistered-page.component.css']
})
export class UnregisteredPageComponent{

  @Input()
  location: [String, String] = ["", ""];

  @Input()
  routeLength1?: number;

  subscribeToListenSubmit($event: [String, String]) { this.location = $event; }

  subscribeToListenRouteLength($event: number){this.routeLength1 = $event};

  constructor(private mapService: MapEstimationService){}

}
