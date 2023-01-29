import {Component} from '@angular/core';
import * as L from "leaflet";
import * as SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import * as Stomp from "stompjs";


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
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {

    isLoaded: boolean = false;
    stompClient: any;


    private map?: L.Map;
    private routeControl?: L.Routing.Control;

    private destinationCoordinates?: L.LatLng;
    private departureCoordinates?: L.LatLng;

    private driverLocationMarkers?: L.LayerGroup;

    private initMap(): void {
        this.map = L.map("estimation-map", {
            center: [45.267136, 19.833549],
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
        let socket = new SockJS(environment.serverOrigin + "socket");
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            this.isLoaded = true;
            this.openSocket();
        })
    }

    openSocket() {
        if (this.isLoaded) {
            this.stompClient.subscribe('/active/vehicle/location', (message: { body: string }) => {
                this.handleMessage(message);
            });
        }
    }

    handleMessage(message: { body: string }) {
        let activeDriversLocations: [{ latitude: number, longitude: number }] = JSON.parse(message.body);
        this.refreshActiveDrivers(activeDriversLocations);
    }


    private refreshActiveDrivers(locations: [{ latitude: number, longitude: number }]) {

        if (this.driverLocationMarkers !== undefined) {
            this.driverLocationMarkers.clearLayers();
        }

        if (this.map !== undefined) {
            locations.forEach(location => {
                let marker = L.marker([location.latitude, location.longitude], {icon: carMarkerIcon})
                    .addTo(this.driverLocationMarkers!)
                this.driverLocationMarkers?.addLayer(marker);
            })
        }
    }


}
