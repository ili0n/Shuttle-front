import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, startWith, Subscriber, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { DriverService } from '../driver/driver.service';
import { MapEstimationService, RouteBaseInfo } from '../services/map/map-estimation.service';
import { Stomp } from "@stomp/stompjs"
import { environment } from 'src/environments/environment';

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
  isLoaded: boolean = false;
  stompClient: any;

  constructor(private mapService: MapEstimationService){
  }


  private map?: L.Map;
  private routeControl?: L.Routing.Control;

  private destinationCoordinates?: L.LatLng;
  private departureCoordinates?: L.LatLng;

  private driverLocationMarkers?: L.LayerGroup;

  private initMap(): void{
    this.map = L.map("estimation-map", {
      center: [ 45.267136, 19.833549 ],
      zoom: 3
    })

    this.driverLocationMarkers = L.layerGroup();
    this.driverLocationMarkers.addTo(this.map!);

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
    let socket = new SockJS(environment.serverOrigin + "socket");
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () =>{
      this.isLoaded = true;
      this.openSocket();
    })
  }
  openSocket() {
    if(this.isLoaded){
      this.stompClient.subscribe('/active/vehicle/location', (message: {body: string}) =>{
        this.handleMessage(message);        
      });
    }
  }

  handleMessage(message: {body: string}){
    let activeDriversLocations: [{latitude: number, longitude: number}] = JSON.parse(message.body);
    this.refreshActiveDrivers(activeDriversLocations); 
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
      }).on('routesfound', e => {
        let routes = e.routes;
        let summary = routes[0].summary;
        let routeLength: number = summary.totalDistance / 1000;
        let time: number = Math.round(summary.totalTime / 60);
        this.routeInfoEmitter?.emit({
          "routeLength": routeLength,
          "time": time
        });
      }).addTo(this.map);
      this.routeControl.show();   
    }
  }

  private refreshActiveDrivers(locations: [{latitude: number, longitude: number}]) {
    
        if(this.driverLocationMarkers !== undefined){
          this.driverLocationMarkers.clearLayers();
        }

        if(this.map !== undefined){
          locations.forEach(location => {
            let marker = L.marker([location.latitude, location.longitude], {icon: carMarkerIcon})
            .addTo(this.driverLocationMarkers!)
            this.driverLocationMarkers?.addLayer(marker);
          })
        }
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

        if(this.routeControl !== undefined)
          this.map?.removeControl(this.routeControl!);

        this.departureCoordinates = departureLocation[0];

        this.destinationCoordinates = destinationLocation[0];
        this.route();
      });
    });

  }


}


