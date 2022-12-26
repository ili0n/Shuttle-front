import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {

  constructor(private http: HttpClient) { }

  getAllVehicleTypes(): Observable<Array<String>>{
    return new Observable((observer) =>{
      let types = ["Standard", "Fancy", "Low quality"];
      observer.next(types);
    })
    // return this.http.get<Array<String>>("localhost:4200/api/vehicleTypes");
  }
}
