import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { MapEstimationService } from '../services/map/map-estimation.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-estimation-map',
  templateUrl: './estimation-map.component.html',
  styleUrls: ['./estimation-map.component.css']
})
export class EstimationMapComponent implements AfterViewInit, OnChanges {

  @Input()
  currentRoute: [String, String] = ["", ""];

  constructor(private mapService: MapEstimationService){}

  private map?: L.Map;
  private destinationMarker?: L.Marker;
  private departureMarker?: L.Marker;

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

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.refresh();
  }
  ngOnChanges(): void {
    this.refresh();
  }
  
  private refresh(): void{
    
    if(this.currentRoute[0] === "" ||
      this.currentRoute[1] === "" ||
      this.map === undefined ||
      this.destinationMarker === undefined ||
      this.departureMarker === undefined){
      return;
    }

    this.map.removeLayer(this.destinationMarker);
    this.map.removeLayer(this.departureMarker);
    
    this.mapService.search(this.currentRoute[0]).subscribe({
      next: (result) => {
        if(this.map !== undefined){
        this.departureMarker = L.marker([result[0].lat, result[0].lon], {icon: iconDefault})
          .addTo(this.map)
          .bindPopup('Departure')
          .openPopup();
        }
      },
      error: () => {},
    });

    this.mapService.search(this.currentRoute[1]).subscribe({
      next: (result) => {
        if(this.map !== undefined){
        // console.log(result);
        this.destinationMarker = L.marker([result[0].lat, result[0].lon], {icon: iconDefault})
          .addTo(this.map)
          .bindPopup('Destination')
          .openPopup();
        }
      },
      error: () => {},
    });
      
  }

}
