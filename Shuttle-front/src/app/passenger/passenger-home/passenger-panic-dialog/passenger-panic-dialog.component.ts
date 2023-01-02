import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-passenger-panic-dialog',
  templateUrl: './passenger-panic-dialog.component.html',
  styleUrls: ['./passenger-panic-dialog.component.css']
})
export class PassengerPanicDialogComponent {
    panicFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<PassengerPanicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private readonly formBuilder: FormBuilder) {
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
