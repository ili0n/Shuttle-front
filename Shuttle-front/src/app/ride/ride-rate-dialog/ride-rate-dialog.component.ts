import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReviewSendDTO } from 'src/app/review/review.service';

export interface ReviewDialogResult {
    vehicle: ReviewSendDTO,
    driver: ReviewSendDTO,
}


@Component({
  selector: 'app-ride-rate-dialog',
  templateUrl: './ride-rate-dialog.component.html',
  styleUrls: ['./ride-rate-dialog.component.css']
})
export class RideRateDialogComponent {
    formGroup: FormGroup;
    protected possibleRatings = ['', '1', '2', '3', '4', '5'];

    constructor(public dialogRef: MatDialogRef<RideRateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private readonly formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({
            commentVehicle: [''],
            commentDriver: [''],
            ratingVehicle: [],
            ratingDriver: [],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onOk(): void {
        const rV: ReviewSendDTO = {
            rating: Number(this.formGroup.get('ratingVehicle')?.getRawValue()),
            comment: this.formGroup.get('commentVehicle')?.getRawValue()
        }
        const rD: ReviewSendDTO = {
            rating: Number(this.formGroup.get('ratingDriver')?.getRawValue()),
            comment: this.formGroup.get('commentDriver')?.getRawValue()
        }
        const result: ReviewDialogResult = {
            vehicle: rV,
            driver: rD,
        };

        this.dialogRef.close(result);
    }
}
