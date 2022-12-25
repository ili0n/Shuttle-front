import { HttpClient, HttpResponse } from '@angular/common/http';
import { ExpansionCase } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapEstimationService {
  private iterator: IterableIterator<Array<[number, number]>>;
  
  

  constructor(private http: HttpClient) { 
    this.iterator = this.locationGeneratorIterator();
  }

  search(place: String): Observable<any>{
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + place
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }


  getActiveDriversLocations(): Observable<[number, number][]> {
    // TODO: on backend
    // return this.http.get<Array<L.LatLng>>("");

    return new Observable(observer => {
      setTimeout(() => {}, 1000);
      let nextLocation = this.iterator.next().value;
      observer.next(nextLocation);
    });
  }

  *locationGeneratorIterator(): IterableIterator<Array<[number, number]>>{

    let vehicleAPosition: [number, number] = [20.267136, 19.833549];
    let vehicleBPosition: [number, number] = [30.267136, 69.833549];

    let incrementA = -4;
    let incrementB = 2;

    while(true){
      vehicleAPosition = [vehicleAPosition[0] + incrementA, vehicleAPosition[1] + incrementA];
      vehicleBPosition = [vehicleBPosition[0] + incrementB, vehicleBPosition[1] + incrementB];
      yield [vehicleAPosition, vehicleBPosition];
    }

  }

}
