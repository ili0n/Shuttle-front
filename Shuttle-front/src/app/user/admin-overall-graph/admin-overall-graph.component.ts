import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getGraphData, GraphEntry, RideService } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-admin-overall-graph',
  templateUrl: './admin-overall-graph.component.html',
  styleUrls: ['./admin-overall-graph.component.css']
})
export class AdminOverallGraphComponent{
  protected getDataFunc: getGraphData;

  costSumLabel = "Money";
  numberOfRidesLabel = "Number of rides";
  lengthLabel = "Length in km";

constructor(private rideService: RideService){
  this.getDataFunc = this.rideService.getOverallGraphData;
}
}
