import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Component,ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title: string = 'shuttle-front';

    constructor(private httpClient: HttpClient) { }

    
    helloBackend() {
        const obs: Observable<Object> = this.httpClient.get(environment.serverOrigin + "hello", {
            observe: "body",
            responseType: "text",
        });

        obs.subscribe(result => alert(result));
    }
}
