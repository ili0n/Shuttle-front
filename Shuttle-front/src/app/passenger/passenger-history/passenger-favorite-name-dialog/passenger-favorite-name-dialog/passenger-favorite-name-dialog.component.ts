import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-passenger-favorite-name-dialog',
  templateUrl: './passenger-favorite-name-dialog.component.html',
  styleUrls: ['./passenger-favorite-name-dialog.component.css']
})
export class PassengerFavoriteNameDialogComponent {
  form  = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<PassengerFavoriteNameDialogComponent>,
    private formBuilder: FormBuilder) {
  }

  cancel(): void {
      this.dialogRef.close();
  }

  submit(): void {
      this.dialogRef.close(this.form.value);
  }
}
