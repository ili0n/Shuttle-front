import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CreateRide, Estiamtion, MapEstimationService } from '../services/map/map-estimation.service';
import { VehicleTypeService } from '../services/vehicle-type/vehicle-type.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.css'],
})
export class EstimationFormComponent implements OnInit{
  routeForm = this.formBuilder.group({
    destination: ["", Validators.required],
    departure: ["", Validators.required],
    babyTransport: new FormControl(false),
    petTransport: new FormControl(false),
    selectVehicleType: ["", Validators.required],
  })
  vehicleTypes: Array<String> = [];
  estimation?: Estiamtion;
  private createRide?: CreateRide;

  @Output() submitEmitter: EventEmitter<[String, String]> = new EventEmitter<[String, String]>();
  @Input() routeLength: number = 0;


  constructor(private formBuilder: FormBuilder, private vehicleTypeService: VehicleTypeService,
     private mapEstimationService: MapEstimationService){}
  
  ngOnInit(): void {
    this.fillSelect();
  }
  
  onSubmit(): void{
    if(this.routeForm.valid){
      let destinationVal = this.routeForm.value.destination!;
      let departureVal = this.routeForm.value.departure!;

      this.emit(destinationVal, departureVal);

      this.mapEstimationService.search(destinationVal).subscribe(destinationLocation =>{
        this.mapEstimationService.search(departureVal).subscribe(departureLocation =>{
          {
            this.createRide = this.createRideDTO(destinationLocation, departureLocation);
            this.mapEstimationService.getEstimation(this.createRide).subscribe(result =>{
              this.estimation = result;
            });
          }
        })
      })
    }
  }

  private fillSelect(){
    this.vehicleTypeService.getAllVehicleTypes().subscribe(
      result => {
        this.vehicleTypes = result; 
      }
    )
  }

  emit(destinationVal: String, departureVal: String): void{
    this.submitEmitter.emit(
      [
        departureVal!,
        destinationVal!,
      ]
      );
  }

  createRideDTO(destinationLocation :any, departureLocation: any): CreateRide{
    return this.createRide = {
      "locations": [
        {
          "departure": {
            "address": this.routeForm.value.departure!,
            "latitude": departureLocation.latitude,
            "longitude": departureLocation.longitude
          },
          "destination": {
            "address": this.routeForm.value.destination!,
            "latitude": destinationLocation.latitude,
            "longitude": destinationLocation.longitude
          }
        }
      ],
      "vehicleType": this.routeForm.value.selectVehicleType!,
      "babyTransport": this.routeForm.controls["babyTransport"].value!,
      "petTransport": this.routeForm.controls["petTransport"].value!,
      "routeLength": this.routeLength!
    }
  }

}


