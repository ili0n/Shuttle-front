import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private canToggleActivity: Subject<boolean> = new Subject();
    private refreshToggle: Subject<void> = new Subject();

    constructor() { }

    public getCanToggleActivity(): Observable<boolean> {
        return this.canToggleActivity.asObservable();
    }

    public getRefreshToggle(): Observable<void> {
        return this.refreshToggle;
    }

    public setCanToggleActivity(canToggleActivity: boolean) {
        this.canToggleActivity.next(canToggleActivity);
    }

    public sendRefreshToggle() {
        this.refreshToggle.next();
    }
}
