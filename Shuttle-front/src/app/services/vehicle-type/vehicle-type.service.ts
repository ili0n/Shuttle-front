import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {

  constructor(private http: HttpClient) { }

  getAllVehicleTypes(): Observable<Array<String>>{
    return this.http.get<Array<String>>(environment.serverOrigin + "api/vehicle/vehicleTypes", {
      observe: "body",
      responseType: "json",
    });
  }
}
