import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User{
    "id": number,
    "name": string,
    "surname": string,
    "profilePicture": string,
    "telephoneNumber": string,
    "email": string,
    "address": string
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  submit(formData: FormData, file: File): void{
    let newFormData: FormData = new FormData();
    newFormData.append('passengerDTO', JSON.stringify(formData));
    // newFormData.append('passengerDTO', new Blob([JSON.stringify(formData)],{type: "application/json"}));
    newFormData.append('picture', file);
    const req = new HttpRequest('POST', `${environment.serverOrigin}api/dummy`, newFormData, {
      headers : new HttpHeaders({ 'Content-Type': 'multipart/form-data; boundary=--------------------------286826552678490793180326' }),
      responseType: 'json'
    });

    console.log(req);
    
    this.http.request(req).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }


}
