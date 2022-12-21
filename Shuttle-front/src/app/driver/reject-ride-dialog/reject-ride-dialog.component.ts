import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-reject-ride-dialog',
    templateUrl: './reject-ride-dialog.component.html',
    styleUrls: ['./reject-ride-dialog.component.css']
})
export class RejectRideDialogComponent {
    rejectFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<RejectRideDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private readonly formBuilder: FormBuilder) {
        this.rejectFormGroup = this.formBuilder.group({
            rejectionReason: ['', [Validators.required]],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onOk(): void {
        this.dialogRef.close(this.rejectFormGroup.value.rejectionReason);
    }
}
