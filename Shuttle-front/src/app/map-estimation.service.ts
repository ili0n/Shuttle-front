import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapEstimationService {
  

  constructor(private http: HttpClient) { }

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

}
