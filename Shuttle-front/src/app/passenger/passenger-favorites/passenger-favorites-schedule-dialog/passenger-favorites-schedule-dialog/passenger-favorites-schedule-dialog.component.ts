import { Component } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PassengerOrderRideComponent } from 'src/app/passenger/passenger-home/passenger-order-ride/passenger-order-ride.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-passenger-favorites-schedule-dialog',
  templateUrl: './passenger-favorites-schedule-dialog.component.html',
  styleUrls: ['./passenger-favorites-schedule-dialog.component.css']
})
export class PassengerFavoritesScheduleDialogComponent {
  public isLater: boolean = false;
  protected allowedHours: Array<number> = [];
  protected allowedMinutes: Array<number> = [];


  scheduleForm = this.formBuilder.group({
    is_later: new FormControl(),
    later: this.formBuilder.group({
      at_hour: new FormControl(),
      at_minute: new FormControl(),
    })
  });

  
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PassengerFavoritesScheduleDialogComponent>,
    private sharedService: SharedService,
    ){
    this.initAllowedTime();

    this.scheduleForm?.setValidators(PassengerOrderRideComponent.goodTimeValidator());
  }

  submit() {
    console.log(this.scheduleForm.valid)
    if(this.scheduleForm.valid){
      this.dialogRef.close({
        data: this.scheduleForm.value
      });
    }
    else{
      this.sharedService.showSnackBar("Invalid time input", 3000);
    }

  }

  private initAllowedTime(): void {
    for (let i = 0; i <= 23; i++) {
        this.allowedHours.push(i);
    }
    for (let i = 0; i <= 59; i += 15) {
        this.allowedMinutes.push(i);
    }
  }


}
