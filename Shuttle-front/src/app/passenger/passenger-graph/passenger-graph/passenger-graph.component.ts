import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { getGraphData, GraphEntry, RideService } from 'src/app/ride/ride.service';


@Component({
  selector: 'app-passenger-graph',
  templateUrl: './passenger-graph.component.html',
  styleUrls: ['./passenger-graph.component.css']
})
export class PassengerGraphComponent {
  protected getDataFunc: getGraphData;

  costSumLabel = "Money spent";
numberOfRidesLabel = "Number of rides";
lengthLabel = "Length in km";

  constructor(private rideService: RideService){
    this.getDataFunc = this.rideService.getPassengerGraphData;
  }
  
}
