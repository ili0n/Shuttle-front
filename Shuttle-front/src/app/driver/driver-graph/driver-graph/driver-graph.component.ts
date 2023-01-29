import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { getGraphData, GraphEntry, RideService } from 'src/app/ride/ride.service';


@Component({
  selector: 'app-driver-graph',
  templateUrl: './driver-graph.component.html',
  styleUrls: ['./driver-graph.component.css']
})
export class DriverGraphComponent {
protected getDataFunc: getGraphData;

costSumLabel = "Money earned";
numberOfRidesLabel = "Number of rides";
lengthLabel = "Length in km";

constructor(private rideService: RideService){
  this.getDataFunc = this.rideService.getDriverGraphData;
}

}
