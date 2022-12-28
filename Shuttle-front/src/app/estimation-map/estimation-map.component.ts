import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, startWith, Subscriber, Subscription } from 'rxjs';
import { DriverService } from '../driver/driver.service';
import { MapEstimationService, RouteBaseInfo } from '../services/map/map-estimation.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const carMarkerUrl = 'assets/car-marker.png';
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

const carMarkerIcon = L.icon({
  iconUrl: carMarkerUrl,
  shadowUrl,
  iconSize: [48, 48],
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

  @Output()
  routeInfoEmitter: EventEmitter<RouteBaseInfo> = new EventEmitter<RouteBaseInfo>();

  constructor(private mapService: MapEstimationService, private driverService: DriverService){
    this.driverLocationMarkers = L.featureGroup();
    this.pull = interval(3 * 1000).pipe(startWith(0)).subscribe(() => {
      this.refreshActiveDrivers();
    });
  }


  private map?: L.Map;
  private destinationMarker?: L.Marker;
  private departureMarker?: L.Marker;
  private routeControl?: L.Routing.Control;

  private destinationCoordinates?: L.LatLng;
  private departureCoordinates?: L.LatLng;

  private pull: Subscription;
  private driverLocationMarkers?: L.FeatureGroup;

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
    this.refreshRoutes();
  }
  ngOnChanges(): void {
    this.refreshRoutes();
    
  }

  route(): void {
    if(this.map !== undefined &&
       this.departureCoordinates !== undefined &&
        this.destinationCoordinates !== undefined){
      
      this.routeControl = L.Routing.control({
        waypoints: [this.departureCoordinates, this.destinationCoordinates],
        lineOptions: {
          styles: [{color: 'blue', opacity: 1, weight: 5}],
          extendToWaypoints: false,
          missingRouteTolerance: 0,
        },
        routeWhileDragging: false
      }).on('routesfound', this.emitRouteInfo).addTo(this.map);
      this.routeControl.show();   

      this.routeControl
    }
  }

  emitRouteInfo(e: any){
      let routes = e.routes;
      let summary = routes[0].summary;
      let routeLength: number = summary.totalDistance / 1000;
      let time: number = Math.round(summary.totalTime / 60);
      this.routeInfoEmitter?.emit({
        "routeLength": routeLength,
        "time": time
      });
  }

  private refreshActiveDrivers() {
    this.driverService.getActiveDriversLocations().subscribe({
      next: (locations) => {
        if(this.driverLocationMarkers !== undefined){
          this.driverLocationMarkers.remove();
          this.driverLocationMarkers.clearLayers();
        }

        if(this.map !== undefined){
          locations.forEach(location => {
            let marker = L.marker([location.latitude, location.longitude], {icon: carMarkerIcon})
            .addTo(this.map!)
            this.driverLocationMarkers?.addLayer(marker);
          })
        }
      },
      error: () => {}
    });
  }

  private checkInput() {
    return this.currentRoute[0] === "" || this.currentRoute[1] === "" || this.map === undefined;
  }

  
  private refreshRoutes(): void{
    
    if(this.checkInput()){
      return;
    }

    this.mapService.search(this.currentRoute[0]).subscribe(departureLocation => {
      this.mapService.search(this.currentRoute[1]).subscribe(destinationLocation =>{

        if(this.departureMarker !== undefined)
          this.map?.removeLayer(this.departureMarker);
        if(this.destinationMarker !== undefined)
          this.map?.removeLayer(this.destinationMarker);
        if(this.routeControl !== undefined)
          this.map?.removeControl(this.routeControl!);

        this.departureMarker = L.marker([departureLocation[0].lat, departureLocation[0].lon], {icon: iconDefault})
        .addTo(this.map!)
        .bindPopup('Departure')
        .openPopup();
        this.departureCoordinates = departureLocation[0];

        this.destinationMarker = L.marker([destinationLocation[0].lat, destinationLocation[0].lon], {icon: iconDefault})
        .addTo(this.map!)
        .bindPopup('Destination')
        .openPopup();
        this.destinationCoordinates = destinationLocation[0];
        this.route();
      });
    });

  }


}


