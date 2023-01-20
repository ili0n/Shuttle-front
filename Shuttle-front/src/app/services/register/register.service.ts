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

  submit(formData: FormData, file: File): Observable<HttpEvent<any>>{
    const req = new HttpRequest('POST', `${environment.serverOrigin}api/passenger`, formData, {
      responseType: 'json'
    });

    console.log(req);
    
    return this.http.request(req);
  }


}
