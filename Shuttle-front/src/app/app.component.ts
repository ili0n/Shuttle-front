import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private httpClient: HttpClient) { }

    helloBackend() {
        const obs: Observable<Object> = this.httpClient.get("http://localhost:8080/hello", {
            observe: "body",
            responseType: "text",
        });

        obs.subscribe(result => alert(result));
    }
}
