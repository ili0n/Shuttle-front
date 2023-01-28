import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { AuthService } from 'src/app/auth/auth.service';
import { RideService } from 'src/app/ride/ride.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges{


  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input() lineChartData: ChartDataSets[] = [];
  @Input() chartLabels: Array<string> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if(this.chart != undefined){
      this.chart.chart.data.labels = this.chartLabels.map(e => e);
      this.chart.chart.data.datasets = this.lineChartData;
    }
    this.chart?.update();
  }
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.2)',
      borderColor: 'red',
      pointBackgroundColor: 'red',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // green
      backgroundColor: 'rgba(0,255,0,0.2)',
      borderColor: 'green',
      pointBackgroundColor: 'green',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // blue
      backgroundColor: 'rgba(0,0,255,0.2)',
      borderColor: 'blue',
      pointBackgroundColor: 'blue',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';
}
