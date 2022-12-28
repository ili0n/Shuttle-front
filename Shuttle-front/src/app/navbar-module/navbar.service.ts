import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private activitySliderSubject: Subject<boolean> = new Subject();

    constructor() { }

    public refreshActivitySlider(canToggle: boolean) {
        this.activitySliderSubject.next(canToggle);
    }

    public onRefreshActivitySlider(): Observable<boolean> {
        return this.activitySliderSubject.asObservable();
    }
}
