import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VehicleTypeService } from '../services/vehicle-type/vehicle-type.service';


@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.css'],
})
export class EstimationFormComponent implements OnInit{
  routeForm = this.formBuilder.group({
    destination: ["", Validators.required],
    departure: ["", Validators.required],
    babyTransport: [],
    petTransport: [],
    selectVehicleType: ["", Validators.required],
  })
  vehicleTypes: Array<String> = [];

  constructor(private formBuilder: FormBuilder, private vehicleTypeService: VehicleTypeService){}
  
  ngOnInit(): void {
    this.fillSelect();
  }
;
  
  onSubmit(): void{
    this.emit();
  }

  private fillSelect(){
    this.vehicleTypeService.getAllVehicleTypes().subscribe(
      result => {
        this.vehicleTypes = result; 
      }
    )
  }


  @Output() emitter: EventEmitter<[String, String]> = new EventEmitter<[String, String]>();

  emit(): void{
    if(this.routeForm.valid){
      let destinationVal = this.routeForm.value.destination;
      let departureVal = this.routeForm.value.departure;
      this.emitter.emit(
        [
          departureVal!,
          destinationVal!,
        ]
        );
    }
  }

}
