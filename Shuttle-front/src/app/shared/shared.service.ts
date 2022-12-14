import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private snackMessage$ = new BehaviorSubject<any>({});
    constructor() { }

    showSnackBar(message: string, duration: number) {
        this.snackMessage$.next({
            "message": message,
            "duration": duration,
        });
    }

    getSnackMessage(): Observable<any> {
        return this.snackMessage$.asObservable();
    }
}
