import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ride-panic-dialog',
  templateUrl: './ride-panic-dialog.component.html',
  styleUrls: ['./ride-panic-dialog.component.css']
})
export class RidePanicDialogComponent {
    panicFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<RidePanicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private readonly formBuilder: FormBuilder) {
        this.panicFormGroup = this.formBuilder.group({
            reason: ['', [Validators.required]],
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onOk(): void {
        this.dialogRef.close(this.panicFormGroup.get('reason')?.value);
    }
}
