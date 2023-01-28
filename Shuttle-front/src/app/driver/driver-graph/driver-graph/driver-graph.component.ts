import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ChartDataSets } from 'chart.js';
import { AuthService } from 'src/app/auth/auth.service';
import { RideService } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-driver-graph',
  templateUrl: './driver-graph.component.html',
  styleUrls: ['./driver-graph.component.css']
})
export class DriverGraphComponent {
  numberOfRidesData: ChartDataSets[] = [];
  costSumData: ChartDataSets[] = [];
  lengthData: ChartDataSets[] = [];
  chartLabels: string[] = [];

  rows: Array<{labelText: string, sum: number, avg: number}> = [];
  columns = ["Label", "Sum", "Average"];
  @ViewChild(MatTable) table?: MatTable<any>;

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef
    ){}

  ngOnInit(): void {
    this.rideService.getDriverGraphData(this.authService.getUserId(), "2021-01-11T17:45:00Z", "2055-01-11T17:45:00Z").subscribe({
      next: result => {

        let numberOfRides = result.map(entry => entry.numberOfRides);
        let numberOfRidesData = [{
          "data": numberOfRides,
          "label": 'Number of rides',
          "type": "line",
          "lineTension": 0 
         }];

         let costSum = result.map(entry => entry.costSum);
         let costSumData = [{
          "data": costSum,
          "label": 'Money earned',
          "type": "line",
          "lineTension": 0 
         }];

         let length = result.map(entry => entry.length);
         let lengthData = [{
          "data": length,
          "label": 'Length in km',
          "type": "line",
          "lineTension": 0 
         }];
         //console.log([numberOfRides, costSum, length]);

         let chartLabels = result.map(entry =>  entry.time);
         //console.log(chartLabels);

         this.numberOfRidesData = numberOfRidesData;
         this.costSumData = costSumData;
         this.lengthData = lengthData;
         this.chartLabels = chartLabels;
         this.calculateAndAdd(numberOfRides, costSum, length);
      },
      error: err => console.log(err)
    })
  }
  calculateAndAdd(numberOfRides: number[], costSum: number[], length: number[]) {
    this.addRow("Number of rides", numberOfRides);
    this.addRow("Money earned", costSum);
    this.addRow("Length", length);
    this.changeDetectorRefs.detectChanges();
    this.table?.renderRows();
  }
  addRow(labelText: string, arr: number[]) {
    let add = (a: number, b: number) => a + b;
    let sum = arr.reduce(add, 0);
    let avg = sum / arr.length;
    this.rows.push({labelText: labelText, sum: sum, avg: avg});
  }

}
