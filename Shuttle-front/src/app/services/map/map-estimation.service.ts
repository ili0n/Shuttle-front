import { HttpClient, HttpResponse } from '@angular/common/http';
import { ExpansionCase } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RouteBaseInfo{
  routeLength: number,
  time: number
}

export interface Location {
  latitude: number,
  longitude: number,
  address: String,
}

export interface Estiamtion{
  estimatedCost: number,
  estimatedTimeInMinutes: number
}

export interface Route{
  "departure": Location
  "destination": Location
}

export interface CreateRide{
    "locations": Route[]
    "vehicleType": string
    "babyTransport": boolean,
    "petTransport": boolean
    "routeLength": number
}

export interface Location {
  latitude: number,
  longitude: number,
  address: String,
}

@Injectable({
  providedIn: 'root'
})
export class MapEstimationService {

  constructor(private http: HttpClient) { 
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

  getActiveDriversLocations(): Observable<Array<Location>> {
    return this.http.get<Array<Location>>(environment.serverOrigin + "api/driver/active", {
      observe: "body",
      responseType: "json",
    });
  }

  getEstimation(createRideEstimation: CreateRide): Observable<Estiamtion> {
    return this.http.post<Estiamtion>(environment.serverOrigin + "api/unregisteredUser", createRideEstimation);
  }
}
