import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {
    constructor(private sharedService: SharedService, private snackBar: MatSnackBar) {

    }

    ngOnInit() {
        this.sharedService.getSnackMessage().subscribe((val) => {
            if (val.message != undefined && val.duration != undefined) {
                this.snackBar.open(val.message, '', {
                    duration: val.duration
                });
            }
        });
    }
}
