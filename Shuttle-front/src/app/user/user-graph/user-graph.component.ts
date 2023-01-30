import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ChartDataSets } from 'chart.js';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getGraphData, GraphEntry, RideService } from 'src/app/ride/ride.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'



@Component({
  selector: 'app-user-graph',
  templateUrl: './user-graph.component.html',
  styleUrls: ['./user-graph.component.css']
})
export class UserGraphComponent {
  hasData: boolean = false;

  numberOfRidesData: ChartDataSets[] = [];
  costSumData: ChartDataSets[] = [];
  lengthData: ChartDataSets[] = [];
  chartLabels: string[] = [];

  @Input() getGraphDataFunc?: getGraphData;

  @Input() numberOfRidesLabel :string = "";
  @Input() costSumLabel :string = "";
  @Input() lengthLabel :string = "";

  @Input() userId?: number;

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

    console.log(this.authService.getRole());
    if(this.authService.getRole() === "passenger" || this.authService.getRole() === "driver"){
      this.userId = +this.authService.getId();
    }

    if(this.getGraphDataFunc !== undefined){
      this.getGraphDataFunc = this.getGraphDataFunc.bind(this.rideService);
      // if nullish set to -1
      this.getGraphDataFunc(wayBackStr, wayForwardStr, this.userId ?? -1).subscribe({
        next: result => {
          this.hasData = result.length != 0;
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
    let avg = arr.length ? sum / arr.length : 0;
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

      this.getGraphDataFunc!(startStr, endStr, this.authService.getUserId()).subscribe({
        next: result => {
          this.showData(result);
        },
        error: err => console.log(err)
      })
    }
  }

  showData(result: import("src/app/ride/ride.service").GraphEntry[]) {

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


  convetToPDF(){
    let table = document.getElementsByTagName("table")[0] as HTMLElement;
    let title = 'report-generated-on-' + (new Date()).toDateString() + ".pdf";
    let canvases: HTMLCollectionOf<Element> = document.getElementsByTagName("canvas");

    let dimensions = {
      top: 50,
      padding: 30
    }

    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    pdf.setProperties({
      title: title,
      subject: title
    });
    pdf.text("Report on money, length and number od rides ", pdf.internal.pageSize.getWidth() / 2, 20, {align: "center", lineHeightFactor: 2});
    pdf.text(" Generated on " + new Date().toLocaleDateString(), 20, 40, {lineHeightFactor: 0.6});
    let i = 0;
    while (i < canvases.length) {
      let canvas = canvases[i] as HTMLCanvasElement;
      dimensions.top += this.addCanvas(canvas, pdf, i, dimensions);
      ++i;
    }

    // pdf.addPage();
    autoTable(pdf, {
      html: "table",
      startY: dimensions.top
    })
    pdf.save(title);
  }

  addCanvas(canvas: HTMLCanvasElement, pdf: jsPDF, i: number, dimensions: {top: number, padding: number}){
    let canvasHeight = canvas.height;
    let canvasWidth = canvas.height;

    const pageWidth = pdf.internal.pageSize.getWidth();

    if (canvasWidth > pageWidth) {
      const ratio = pageWidth / canvasWidth;
      canvasHeight = canvasHeight * ratio - dimensions.padding;
      canvasWidth = canvasWidth * ratio - dimensions.padding;
    }

    const pageHeight = pdf.internal.pageSize.getHeight();

    if (dimensions.top + canvasHeight > pageHeight) {
      pdf.addPage();
      dimensions.top = 20;
    }

    const contentDataURL = canvas .toDataURL('image/png')

    pdf.addImage(contentDataURL, "PNG", dimensions.padding / 2, dimensions.top, canvasWidth, canvasHeight, `image${i}`);
    return canvasHeight + dimensions.padding;
  }

}
