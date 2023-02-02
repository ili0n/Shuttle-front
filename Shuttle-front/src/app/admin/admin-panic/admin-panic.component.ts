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
        this.panics = new Array<PanicDTO>();
        this.adminService.get(this.page).forEach(value => {
            this.panics.push(value)
        });
    }

    cardOnClick(index: number): void {
        this.selectedCard = this.panics[index];
    }

}
