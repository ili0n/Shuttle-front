import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { MapEstimationService } from '../map-estimation.service';

@Component({
  selector: 'app-unregistered-page',
  templateUrl: './unregistered-page.component.html',
  styleUrls: ['./unregistered-page.component.css']
})
export class UnregisteredPageComponent implements OnInit, DoCheck{

  @Input()
  location: [String, String] = ["", ""];

  subscribeToListenSubmit($event: [String, String]) { this.location = $event; }

  constructor(private mapService: MapEstimationService){}

  ngOnInit(): void {
    this.refresh();
  }
  ngDoCheck(): void {
    this.refresh();
  }
  
  private refresh(): void{
    //console.log(location.toString());
    
    if(this.location[0] === "" || this.location[1] === ""){
      return;
    }
    
    console.log("received");
      

    this.mapService.search(this.location[0]).subscribe({
      next: (result) => {
        console.log(result);
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
    this.mapService.search(this.location[1]);
  }

  

}
