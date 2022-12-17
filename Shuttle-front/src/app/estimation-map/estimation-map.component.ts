import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-estimation-map',
  templateUrl: './estimation-map.component.html',
  styleUrls: ['./estimation-map.component.css']
})
export class EstimationMapComponent implements AfterViewInit {

  private map?: L.Map;

  private initMap(): void{
    this.map = L.map("estimation-map", {
      center: [ 45.267136, 19.833549 ],
      zoom: 3
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor(){}

  ngAfterViewInit(): void {
    this.initMap();
  }

}
