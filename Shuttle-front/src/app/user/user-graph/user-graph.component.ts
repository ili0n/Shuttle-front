import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ChartDataSets } from 'chart.js';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GraphEntry, RideService } from 'src/app/ride/ride.service';


type getGraphData = (id: number, startDate: string, endDate: string) => Observable<Array<GraphEntry>>;

@Component({
  selector: 'app-user-graph',
  templateUrl: './user-graph.component.html',
  styleUrls: ['./user-graph.component.css']
})
export class UserGraphComponent {
  numberOfRidesData: ChartDataSets[] = [];
  costSumData: ChartDataSets[] = [];
  lengthData: ChartDataSets[] = [];
  chartLabels: string[] = [];

  @Input() getGraphDataFunc?: getGraphData;

  @Input() numberOfRidesLabel :string = "";
  @Input() costSumLabel :string = "";
  @Input() lengthLabel :string = "";

  rows: Array<{labelText: string, sum: number, avg: number}> = [];
  columns = ["Label", "Sum", "Average"];
  @ViewChild(MatTable) table?: MatTable<any>;

  range = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef
    ){}

  ngOnInit(): void {let wayBack: Date = new Date();
    wayBack.setFullYear(2000);
    let wayBackStr: string = new Date(wayBack.getTime() - (wayBack.getTimezoneOffset() * 60000)).toISOString();

    let wayForward: Date = new Date();
    wayBack.setFullYear(2055);
    let wayForwardStr: string = new Date(wayForward.getTime() - (wayForward.getTimezoneOffset() * 60000)).toISOString();

    if(this.getGraphDataFunc !== undefined){
      this.getGraphDataFunc = this.getGraphDataFunc.bind(this.rideService);
      this.getGraphDataFunc(this.authService.getUserId(), wayBackStr, wayForwardStr).subscribe({
        next: result => {
          this.showData(result);
        },
        error: err => console.log(err)
      })
    }
  }
  calculateAndAdd(numberOfRides: number[], costSum: number[], length: number[]) {
    this.rows = [];
    this.addRow(this.numberOfRidesLabel, numberOfRides);
    this.addRow(this.costSumLabel, costSum);
    this.addRow(this.lengthLabel, length);
    this.changeDetectorRefs.detectChanges();
    this.table?.renderRows();
  }
  addRow(labelText: string, arr: number[]) {
    let add = (a: number, b: number) => a + b;
    let sum = arr.reduce(add, 0);
    let avg = arr ? sum / arr.length : 0;
    this.rows.push({labelText: labelText, sum: sum, avg: avg});
  }

  dateRangeChange(startInput: HTMLInputElement, endInput: HTMLInputElement){
    console.log(startInput.value);
    console.log(endInput.value);
    if(this.range.valid){
      let start: Date = new Date(startInput.value);
      let startStr: string = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString();

      let end: Date = new Date(endInput.value);
      let endStr: string = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString();

      this.rideService.getDriverGraphData(this.authService.getUserId(), startStr, endStr).subscribe({
        next: result => {
          this.showData(result);
        },
        error: err => console.log(err)
      })
    }
  }

  showData(result: import("src/app/ride/ride.service").GraphEntry[]) {
    if(result.length === 0){
      return;
    }

    let numberOfRides = result.map(entry => entry.numberOfRides);
    let numberOfRidesData = [{
      "data": numberOfRides,
      "label": this.numberOfRidesLabel,
      "type": "line",
      "lineTension": 0 
     }];

     let costSum = result.map(entry => entry.costSum);
     let costSumData = [{
      "data": costSum,
      "label": this.costSumLabel,
      "type": "line",
      "lineTension": 0 
     }];

     let length = result.map(entry => entry.length);
     let lengthData = [{
      "data": length,
      "label": this.lengthLabel,
      "type": "line",
      "lineTension": 0 
     }];

     let chartLabels = result.map(entry =>  entry.time);

     this.numberOfRidesData = numberOfRidesData;
     this.costSumData = costSumData;
     this.lengthData = lengthData;
     this.chartLabels = chartLabels;
     this.calculateAndAdd(numberOfRides, costSum, length);
  }
}
