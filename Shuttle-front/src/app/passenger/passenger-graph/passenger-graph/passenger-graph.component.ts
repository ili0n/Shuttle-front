import { Component } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/auth/auth.service';
import { RideService } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-passenger-graph',
  templateUrl: './passenger-graph.component.html',
  styleUrls: ['./passenger-graph.component.css']
})
export class PassengerGraphComponent {

  numberOfRidesData: ChartDataSets[] = [];
  costSumData: ChartDataSets[] = [];
  lengthData: ChartDataSets[] = [];
  chartLabels: string[] = [];

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    ){}

  ngOnInit(): void {
    this.rideService.getPassengerGraphData(this.authService.getUserId(), "2021-01-11T17:45:00Z", "2055-01-11T17:45:00Z").subscribe({
      next: result => {

        let numberOfRides = [{
          "data": result.map(entry => entry.numberOfRides),
          "label": 'Number of rides',
          "type": "line",
          "lineTension": 0 
         }];

         let costSum = [{
          "data": result.map(entry => entry.costSum),
          "label": 'Cost sum',
          "type": "line",
          "lineTension": 0 
         }];

         let length = [{
          "data": result.map(entry => entry.length),
          "label": 'Length in km',
          "type": "line",
          "lineTension": 0 
         }];
         //console.log([numberOfRides, costSum, length]);

         let chartLabels = result.map(entry =>  entry.time);
         //console.log(chartLabels);

         this.numberOfRidesData = numberOfRides;
         this.costSumData = costSum;
         this.lengthData = length;
         this.chartLabels = chartLabels;
      },
      error: err => console.log(err)
    })
  }
}
