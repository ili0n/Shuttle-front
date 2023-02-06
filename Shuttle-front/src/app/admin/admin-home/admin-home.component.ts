import {Component} from '@angular/core';
import * as L from "leaflet";
import * as SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import * as Stomp from "stompjs";
import {VehicleLocationDTO} from "../admin.service";


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const carAvailableMarkerUrl = 'assets/ico_car_avail.png';
const carBusyMarkerUrl = 'assets/ico_car_busy.png';
const luxuryAvailableMarkerUrl = 'assets/ico_luxury_avail.png';
const luxuryBusyMarkerUrl = 'assets/ico_luxury_busy.png';
const vanAvailableMarkerUrl = 'assets/ico_van_avail.png';
const vanBusyMarkerUrl = 'assets/ico_van_busy.png';
const panicUrl = 'assets/car-marker-panic.png'
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

const carAvailableIcon = L.icon({
    iconUrl: carAvailableMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const carBusyIcon = L.icon({
    iconUrl: carBusyMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const luxuryAvailableIcon = L.icon({
    iconUrl: luxuryAvailableMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const luxuryBusyIcon = L.icon({
    iconUrl: luxuryBusyMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const vanAvailableIcon = L.icon({
    iconUrl: vanAvailableMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const vanBusyIcon = L.icon({
    iconUrl: vanBusyMarkerUrl,
    shadowUrl,
    iconSize: [48, 48],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
const panicIcon = L.icon({
    iconUrl: panicUrl,
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
    stompClient: Stomp.Client | undefined;


    private map?: L.Map;
    private routeControl?: L.Routing.Control;

    private destinationCoordinates?: L.LatLng;
    private departureCoordinates?: L.LatLng;

    private driverLocationMarkers?: L.LayerGroup;
    plates: Array<string> = new Array<string>();

    private initMap(): void {
        this.map = L.map("admin-home-map", {
            center: [45.267136, 19.833549],
            zoom: 13
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
            if (this.stompClient)
                this.stompClient.subscribe('/active/vehicle/location/all', (message: { body: string }) => {
                    this.handleMessage(message);
                });
        }
    }

    handleMessage(message: { body: string }) {
        let activeDriversLocations: [VehicleLocationDTO] = JSON.parse(message.body);
        this.refreshActiveDrivers(activeDriversLocations);
    }


    private refreshActiveDrivers(locations: [VehicleLocationDTO]) {

        if (this.driverLocationMarkers !== undefined) {
            this.driverLocationMarkers.clearLayers();
        }
        this.plates = new Array<string>();
        if (this.map !== undefined) {
            locations.forEach(location => {
                let icon = panicIcon;
                if (!location.panic) {
                    switch (location.vehicleType.toLowerCase()) {
                        case "standard": {
                            if (location.available) icon = carAvailableIcon
                            else icon = carBusyIcon;
                            break;
                        }
                        case "van": {
                            if (location.available) icon = vanAvailableIcon
                            else icon = vanBusyIcon;
                            break;
                        }
                        case "luxury": {
                            if (location.available) icon = luxuryAvailableIcon
                            else icon = luxuryBusyIcon;
                            break;
                        }
                    }
                }
                let marker = L.marker([location.location.latitude, location.location.longitude], {icon: icon})
                    .addTo(this.driverLocationMarkers!);
                this.plates.push(location.licencePlate);
                this.driverLocationMarkers?.addLayer(marker);
            })
        }
    }


}


