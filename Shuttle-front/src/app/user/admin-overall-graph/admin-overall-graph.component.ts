import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { AuthService } from 'src/app/auth/auth.service';
import { RideService } from 'src/app/ride/ride.service';

export interface UserChartData{
  numberOfRidesData: ChartDataSets[];
  costSumData: ChartDataSets[];
  lengthData: ChartDataSets[];
  chartLabels: string[];

  numberOfRidesLabel :string;
  costSumLabel :string;
  lengthLabel :string;

}

@Component({
  selector: 'app-admin-overall-graph',
  templateUrl: './admin-overall-graph.component.html',
  styleUrls: ['./admin-overall-graph.component.css']
})
export class AdminOverallGraphComponent implements OnInit{

  driverChartData: UserChartData;
  passengerChartData: UserChartData;

  constructor(private rideService: RideService, authService: AuthService){
    this.driverChartData = {
      numberOfRidesData: [],
      costSumData: [],
      lengthData: [],
      chartLabels: [],
    
      numberOfRidesLabel: "Number of rides",
      costSumLabel: "Money",
      lengthLabel: "Length"
    }

    this.passengerChartData = {
      numberOfRidesData: [],
      costSumData: [],
      lengthData: [],
      chartLabels: [],
    
      numberOfRidesLabel: "Number of rides",
      costSumLabel: "Money",
      lengthLabel: "Length"
    }
  }

  ngOnInit(): void {
    this.rideService.getOverallDriverGraphData().subscribe({
      next: result => {
        this.showData(result, this.driverChartData);
      },
      error: err => console.log(err)
    });

    this.rideService.getOverallPassengerGraphData().subscribe({
      next: result => {
        this.showData(result, this.passengerChartData);
      },
      error: err => console.log(err)
    });
  }

showData(result: import("src/app/ride/ride.service").GraphEntry[], userChartData: UserChartData) {
  if(result.length === 0){
    return;
  }

  let numberOfRides = result.map(entry => entry.numberOfRides);
  let numberOfRidesData = [{
    "data": numberOfRides,
    "label": userChartData.numberOfRidesLabel,
    "type": "line",
    "lineTension": 0 
  }];

  let costSum = result.map(entry => entry.costSum);
  let costSumData = [{
    "data": costSum,
    "label": userChartData.costSumLabel,
    "type": "line",
    "lineTension": 0 
  }];

  let length = result.map(entry => entry.length);
  let lengthData = [{
    "data": length,
    "label": userChartData.lengthLabel,
    "type": "line",
    "lineTension": 0 
  }];

  let chartLabels = result.map(entry =>  entry.time);

  userChartData.numberOfRidesData = numberOfRidesData;
  userChartData.costSumData = costSumData;
  userChartData.lengthData = lengthData;
  userChartData.chartLabels = chartLabels;
  }
}
