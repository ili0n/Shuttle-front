import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FavoriteRouteDTO, RideService } from 'src/app/ride/ride.service';   

@Component({
  selector: 'app-passenger-favorites',
  templateUrl: './passenger-favorites.component.html',
  styleUrls: ['./passenger-favorites.component.css']
})
export class PassengerFavoritesComponent {
  protected favoriteRideDataSource: MatTableDataSource<FavoriteRouteDTO> = new MatTableDataSource();
  protected favoriteRideDisplayedColumns = ["favorite", "name", "route", "passengers", "vehicle type", "baby", "pet", "order again"];
  protected favoriteRides?: Array<FavoriteRouteDTO>;

  constructor(
      private rideService: RideService,
      private authService: AuthService,
      private passengerDialog: MatDialog
  ) {}

  ngOnInit() {
      this.fetchUserFavoriteRides();
  }

  private fetchUserFavoriteRides(): void {
      this.rideService.getFavoriteRides(this.authService.getUserId()).subscribe({
          next: (favoriteRides) => this.onFetchUserFavoriteRides(favoriteRides),
          error: (err) => console.error(err),
      });
  }

  private onFetchUserFavoriteRides(favoriteRides: Array<FavoriteRouteDTO>): void {
      console.log(favoriteRides);
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
        emails: ["john@gmail.com"]
      },
    });

  }

  public orderAgain(favoriteRoute: FavoriteRouteDTO){

  }

}

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
