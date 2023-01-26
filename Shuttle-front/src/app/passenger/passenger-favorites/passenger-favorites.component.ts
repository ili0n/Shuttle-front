import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FavoriteRouteDTO, RideService, RideRequest, RideRequestSingleLocation } from 'src/app/ride/ride.service';   
import * as L from "leaflet";
import 'leaflet-routing-machine';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-passenger-favorites',
  templateUrl: './passenger-favorites.component.html',
  styleUrls: ['./passenger-favorites.component.css']
})
export class PassengerFavoritesComponent implements AfterViewInit, OnDestroy{
  protected favoriteRideDataSource: MatTableDataSource<FavoriteRouteDTO> = new MatTableDataSource();
  protected favoriteRideDisplayedColumns = ["favorite", "name", "route", "passengers", "vehicle type", "baby", "pet", "order again"];
  protected favoriteRides?: Array<FavoriteRouteDTO>;

  private map!: L.Map;
  private route?: L.Routing.Control;

  private routesToRemove: Array<FavoriteRouteDTO> = [];


  constructor(
      private rideService: RideService,
      private authService: AuthService,
      private passengerDialog: MatDialog,
      private router: Router,
      private sharedService: SharedService,
  ) {}


  ngOnDestroy(): void {
    for(let routeToRemove of this.routesToRemove){
      this.rideService.deleteFavorite(routeToRemove).subscribe({
        next: result => console.log(result),
        error: err => this.sharedService.showSnackBar("Failed to remove favorite ride", 3000)
      });
    }
  }

  ngOnInit() {
      this.fetchUserFavoriteRides();
  }

  private initMap(): void{
    this.map = L.map("favorite-map", {
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

  private fetchUserFavoriteRides(): void {
      this.rideService.getFavoriteRides(this.authService.getUserId()).subscribe({
          next: (favoriteRides) => this.onFetchUserFavoriteRides(favoriteRides),
          error: (err) => console.error(err),
      });
  }

  private onFetchUserFavoriteRides(favoriteRides: Array<FavoriteRouteDTO>): void {
      this.favoriteRides = favoriteRides;
      this.favoriteRideDataSource = new MatTableDataSource(favoriteRides);
  }

  public getFavoriteRideRouteString(favoriteRoute: FavoriteRouteDTO): String {
    const dep: String = favoriteRoute.locations[0].departure.address;
    const dest: String = favoriteRoute.locations.at(-1)?.destination.address as string;
    return dep + " 🡒 " + dest;
  }

  public showPassengers(favoriteRoute: FavoriteRouteDTO){
    this.passengerDialog.open(PassengerDialog, {
      data: {
        emails: [favoriteRoute.passengers.map(passenger => passenger.email)]
      },
    });

  }

  public orderAgain(favoriteRoute: FavoriteRouteDTO){    
    let that = this;
    this.constructRouteControl(favoriteRoute);
    this.route!.on("routesfound", function(e){
      let routeLength: number = e.routes[0].summary.totalDistance;
      favoriteRoute.distance = routeLength;
      let rideRequest: RideRequest = that.rideService.favoriteRouteToRideRequest(favoriteRoute);
      
      that.map.removeControl(that.route!);
      
      that.rideService.request(rideRequest).subscribe({
        next: (ride) => that.router.navigate(['passenger/home']),
        error: (err) => {
            that.sharedService.showSnackBar(err.error.message, 3000);
        }
      });
    }).addTo(this.map);

  }

  public displayRoute(favoriteRoute: FavoriteRouteDTO){
    if(this.route != undefined)
      this.map.removeControl(this.route);
    this.constructRouteControl(favoriteRoute);
    let that = this;
    this.route!.on("routesfound", function(e){
    }).addTo(this.map);
  }

  private constructRouteControl(favoriteRoute: FavoriteRouteDTO){
    let departure: RideRequestSingleLocation = favoriteRoute.locations[0].departure;
    let destination: RideRequestSingleLocation = favoriteRoute.locations.at(-1)!.destination;

    let departureLatLng: L.LatLng = L.latLng(departure.latitude, departure.longitude); 
    let destinationLatLng: L.LatLng = L.latLng(destination.latitude, destination.longitude); 

    let waypoints = [departureLatLng, destinationLatLng];  

    this.route = L.Routing.control({
      waypoints: waypoints,
      collapsible: true,
      fitSelectedRoutes: true,
      routeWhileDragging: false,
      plan: L.Routing.plan(waypoints, { draggableWaypoints: false, addWaypoints: false }),
      lineOptions:
      {
          missingRouteTolerance: 0,
          extendToWaypoints: true,
          addWaypoints: false
      },
    })
  }

  public removeFromFavorites(favoriteRoute: FavoriteRouteDTO, i: number){
    if(this.routesToRemove.includes(favoriteRoute)){
      this.removeFromArray(favoriteRoute, this.routesToRemove);
      document.getElementsByClassName("icon")[i].setAttribute("src", "assets/heart_active.png");
    }
    else{
      this.routesToRemove.push(favoriteRoute);
      document.getElementsByClassName("icon")[i].setAttribute("src", "assets/heart-deactivated.png");
    }
  }

  private removeFromArray<T>(element: T, array: Array<T>){
    const index = array.indexOf(element, 0);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

}



// dialog for passengers

@Component({
  selector: 'passenger-dialog',
  template: `
  <h1 mat-dialog-title>Passengers</h1>
  <div mat-dialog-content>
    <ul>
      <li *ngFor="let email of data.emails">
        {{email}}
      </li>
    </ul>
  </div>
  `,
})
export class PassengerDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {emails: Array<string>}) { }
}

