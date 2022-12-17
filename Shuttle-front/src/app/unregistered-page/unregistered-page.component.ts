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

  subscribeToListenSubmit($event: [String, String]) { this.location = $event; }

  constructor(private mapService: MapEstimationService){}

}
