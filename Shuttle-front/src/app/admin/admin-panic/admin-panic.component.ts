import {Component, OnInit} from '@angular/core';
import {AdminService} from "../admin.service";
import {PanicDTO} from "../../ride/ride.service";

@Component({
    selector: 'app-admin-panic',
    templateUrl: './admin-panic.component.html',
    styleUrls: ['./admin-panic.component.css']
})

export class AdminPanicComponent implements OnInit {
    private page = 0;
    panics = new Array<PanicDTO>();
    selectedCard: PanicDTO | undefined

    constructor(private adminService: AdminService) {
    }

    ngOnInit(): void {
        this.getCardsPage()
    }

    getCardsPage(): void {
        let panics = new Array<PanicDTO>();
        this.adminService.getPanics(this.page).subscribe(value => {
            value.forEach(value1 => {
                console.log(value1);
                panics.push(value1);
            })
        });
        console.log(panics);
        this.panics = panics;
    }

    cardOnClick(index: number): void {
        this.selectedCard = this.panics[index];
    }

}
