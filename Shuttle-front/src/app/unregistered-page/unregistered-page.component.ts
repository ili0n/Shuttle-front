import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators, NgModel, NgForm } from '@angular/forms';
import { CreateRide, Estiamtion, MapEstimationService, RouteBaseInfo } from '../services/map/map-estimation.service';
import { VehicleTypeService } from '../services/vehicle-type/vehicle-type.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { interval, startWith, Subscriber, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { DriverService } from '../driver/driver.service';
//import { Stomp } from "@stomp/stompjs"
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';
import { TitleStrategy } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

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
  selector: 'app-unregistered-page',
  templateUrl: './unregistered-page.component.html',
  styleUrls: ['./unregistered-page.component.css']
})
export class UnregisteredPageComponent implements OnInit{

  routeInfo?: RouteBaseInfo;

  routeForm = this.formBuilder.group({
    destination: ["", Validators.required],
    departure: ["", Validators.required],
    babyTransport: new FormControl(false),
    petTransport: new FormControl(false),
    selectVehicleType: ["", Validators.required],
  })
  vehicleTypes: Array<String> = [];
  estimation?: Estiamtion;

  constructor(
    private formBuilder: FormBuilder,
     private vehicleTypeService: VehicleTypeService,
     private mapEstimationService: MapEstimationService,
      private cdf: ChangeDetectorRef){}

  
  onSubmit(): void{
    if(this.routeForm.valid){
      this.refreshRoutes();
    }
  }

  private fillSelect(){
    this.vehicleTypeService.getAllVehicleTypes().subscribe(
      result => {
        this.vehicleTypes = result; 
      }
    )
  }

  createRideDTO(destinationLocation :any, departureLocation: any): CreateRide{
    return { 
          "locations": [
            {
              "departure": {
                "address": this.routeForm.value.departure!,
                "latitude": departureLocation.lat,
                "longitude": departureLocation.lon
              },
              "destination": {
                "address": this.routeForm.value.destination!,
                "latitude": destinationLocation.lat,
                "longitude": destinationLocation.lon
              }
            }
          ],
          "vehicleType": this.routeForm.value.selectVehicleType!,
          "babyTransport": this.routeForm.controls["babyTransport"].value!,
          "petTransport": this.routeForm.controls["petTransport"].value!,
          "routeLength": this.routeInfo?.routeLength!
        }
  }
  isLoaded: boolean = false;
  stompClient: any;
  departureSelection: boolean = true;


  private map?: L.Map;
  private routeControl?: L.Routing.Control;

  private destinationCoordinates?: L.LatLng;
  private departureCoordinates?: L.LatLng;

  private driverLocationMarkers?: L.LayerGroup;
  private locationMarkerLayer?: L.LayerGroup;

  private initMap(): void{
    this.map = L.map("estimation-map", {
      center: [ 45.267136, 19.833549 ],
      zoom: 3
    })

    this.driverLocationMarkers = L.layerGroup();
    this.locationMarkerLayer = L.layerGroup();
    this.driverLocationMarkers.addTo(this.map!);
    this.locationMarkerLayer.addTo(this.map!);


    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);


    this.map.on("click", e => {
      if(this.departureSelection){
        this.departureCoordinates = e.latlng;
        let marker = L.marker([e.latlng.lat, e.latlng.lng], {icon: iconDefault});
        marker.addTo(this.locationMarkerLayer!);

        this.mapEstimationService.reverseSearch(e.latlng.lat, e.latlng.lng).subscribe({
          next: result =>  this.routeForm.controls.departure.setValue(result.display_name),
          error: err => console.error(err)
        });
       
      }
      else{
        this.destinationCoordinates = e.latlng;
        this.mapEstimationService.reverseSearch(e.latlng.lat, e.latlng.lng).subscribe({
          next: result =>  this.routeForm.controls.destination.setValue(result.display_name),
          error: err => console.error(err)
        });
      }
      this.departureSelection = !this.departureSelection;
      this.route();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.fillSelect();
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


  route(): void {
    if(this.map !== undefined &&
       this.departureCoordinates !== undefined &&
        this.destinationCoordinates !== undefined){

      this.clearLocationarkers();
      this.clearRoutes();
      
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
        this.routeInfo = {
          "routeLength": routeLength,
          "time": time
        }
        let destinationVal = this.routeForm.value.destination!;
        let departureVal = this.routeForm.value.departure!;
        this.mapEstimationService.search(destinationVal).subscribe(destinationLocation =>{
          this.mapEstimationService.search(departureVal).subscribe(departureLocation =>{
              let createRide = this.createRideDTO(destinationLocation[0], departureLocation[0]);
              this.mapEstimationService.getEstimation(createRide).subscribe(result =>{
                this.estimation = result;
              });
          })
        })
      }).addTo(this.map);
      this.routeControl.show();   
    }
  }

  private refreshActiveDrivers(locations: [{latitude: number, longitude: number}]) {
    
        this.clearDriverMarkers();
        if(this.map !== undefined){
          locations.forEach(location => {
            let marker = L.marker([location.latitude, location.longitude], {icon: carMarkerIcon})
            .addTo(this.driverLocationMarkers!)
            this.driverLocationMarkers?.addLayer(marker);
          })
        }
  } 

  private checkInput() {
    return this.map === undefined;
  }

  private clearRoutes(){
    if(this.routeControl !== undefined)
          this.map?.removeControl(this.routeControl!);
  }

  private clearDriverMarkers(){
    if(this.driverLocationMarkers !== undefined){
      this.driverLocationMarkers.clearLayers();
    }
  }

  private clearLocationarkers(){
    if(this.locationMarkerLayer !== undefined){
      this.locationMarkerLayer.clearLayers();
    }
  }

  
  private refreshRoutes(): void{
    
    if(this.checkInput()){
      return;
    }

    let departure = this.routeForm.value.departure;
    let destination = this.routeForm.value.destination;
    if(departure === undefined || destination === undefined || departure === null || destination === null){
      return;
    }

    this.mapEstimationService.search(departure).subscribe(departureLocation => {
      this.mapEstimationService.search(destination!).subscribe(destinationLocation =>{

        this.clearRoutes();

        this.departureCoordinates = departureLocation[0];

        this.destinationCoordinates = destinationLocation[0];
        this.route();
      });
    });

  }
}
