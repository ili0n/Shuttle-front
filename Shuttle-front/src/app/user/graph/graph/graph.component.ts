import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges, OnInit{

  ngOnInit(): void {
    this.lineChartColors = [
      {
        backgroundColor: 'rgba(' + this.colorRGB + ' , 0.2)',
        borderColor: 'rgba(' + this.colorRGB + ')',
        pointBackgroundColor: 'rgba(' + this.colorRGB + ')',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ]
  }


  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input() lineChartData: ChartDataSets[] = [];
  @Input() chartLabels: Array<string> = [];
  @Input() colorRGB?: string;

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
  lineChartColors: Color[] = [];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';
}
