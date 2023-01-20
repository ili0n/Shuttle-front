import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReviewPairDTO, ReviewSendDTO } from 'src/app/review/review.service';

export interface ReviewDialogResult {
    vehicle: ReviewSendDTO,
    driver: ReviewSendDTO,
}

export interface ReviewDialogParams {
    currentReview: ReviewPairDTO,
    readonly: boolean
}


@Component({
  selector: 'app-ride-rate-dialog',
  templateUrl: './ride-rate-dialog.component.html',
  styleUrls: ['./ride-rate-dialog.component.css']
})
export class RideRateDialogComponent implements OnInit {
    formGroup: FormGroup;
    protected possibleRatings = ['', '1', '2', '3', '4', '5'];
    private readonly: boolean = false;
    private currentRating: ReviewPairDTO | null = null;


    constructor(public dialogRef: MatDialogRef<RideRateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ReviewDialogParams, private readonly formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({
            commentVehicle: [''],
            ratingVehicle: [],
            commentDriver: [''],
            ratingDriver: [],
        });

        this.readonly = data.readonly;
        this.currentRating = data.currentReview;
    }

    ngOnInit(): void {
        if (this.currentRating != null && this.currentRating != undefined) {
            console.log(this.currentRating);

            this.formGroup.patchValue({
                commentVehicle: this.currentRating.vehicleReview.comment,
                ratingVehicle: String(this.currentRating.vehicleReview.rating),
                commentDriver: this.currentRating.driverReview.comment,
                ratingDriver: String(this.currentRating.driverReview.rating),
            });
        }

        this.onChangeDriverRating();
        this.onChangeVehicleRating();
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

    protected hasRatedDriver(): boolean {
        return Number(this.formGroup.get('ratingDriver')?.getRawValue()) != 0;
    }

    protected hasRatedVehicle(): boolean {
        return Number(this.formGroup.get('ratingVehicle')?.getRawValue()) != 0;
    }

    protected onChangeDriverRating(): void {
        if (this.readonly) {
            this.formGroup.get('ratingDriver')?.disable();
            this.formGroup.get('commentDriver')?.disable();
            return;
        }

        if (!this.hasRatedDriver()) {
            this.formGroup.get('commentDriver')?.disable();
        } else {
            this.formGroup.get('commentDriver')?.enable();
        }
    }

    protected onChangeVehicleRating(): void {
        if (this.readonly) {
            this.formGroup.get('ratingVehicle')?.disable();
            this.formGroup.get('commentVehicle')?.disable();
            return;
        }

        if (!this.hasRatedVehicle()) {
            this.formGroup.get('commentVehicle')?.disable();
        } else {
            this.formGroup.get('commentVehicle')?.enable();
        }
    }
}
