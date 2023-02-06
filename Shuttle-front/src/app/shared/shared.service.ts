import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SnackBarMessage {
    message?: string,
    duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private snackMessage$ = new BehaviorSubject<SnackBarMessage>({});
    constructor() { }

    showSnackBar(message: string, duration: number) {
        this.snackMessage$.next({
            "message": message,
            "duration": duration,
        });
    }

    getSnackMessage(): Observable<SnackBarMessage> {
        return this.snackMessage$.asObservable();
    }
}
