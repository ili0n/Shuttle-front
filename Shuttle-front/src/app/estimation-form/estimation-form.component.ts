import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.css']
})
export class EstimationFormComponent {
  routeForm = this.formBuilder.group({
    destination: ["", Validators.required],
    departure: ["", Validators.required]
  })

  constructor(private formBuilder: FormBuilder){};
  
  onSubmit(): void{
    this.emit();
  }


  @Output() emitter: EventEmitter<[String, String]> = new EventEmitter<[String, String]>();

  emit(): void{
  
    let destinationVal = this.routeForm.value.destination;
    let departureVal = this.routeForm.value.departure;

    if(destinationVal !== null && destinationVal !== undefined && departureVal !== null && departureVal !== undefined){
      this.emitter.emit(
        [
          departureVal,
          destinationVal,
        ]
        );
    }
  }

}
