import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CreateRide, Estiamtion, MapEstimationService, RouteBaseInfo } from '../services/map/map-estimation.service';
import { VehicleTypeService } from '../services/vehicle-type/vehicle-type.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.css'],
})
export class EstimationFormComponent implements OnInit, OnChanges{
  routeForm = this.formBuilder.group({
    destination: ["", Validators.required],
    departure: ["", Validators.required],
    babyTransport: new FormControl(false),
    petTransport: new FormControl(false),
    selectVehicleType: ["", Validators.required],
  })
  vehicleTypes: Array<String> = [];
  estimation?: Estiamtion;

  @Output()
  submitEmitter: EventEmitter<[String, String]> = new EventEmitter<[String, String]>();

  @Input()
  routeInfo?: RouteBaseInfo;


  constructor(private formBuilder: FormBuilder, private vehicleTypeService: VehicleTypeService,
     private mapEstimationService: MapEstimationService, private cdf: ChangeDetectorRef){}
  
  ngOnInit(): void {
    this.fillSelect();
  }
  
  onSubmit(): void{
    if(this.routeForm.valid){
      let destinationVal = this.routeForm.value.destination!;
      let departureVal = this.routeForm.value.departure!;

      this.emit(destinationVal, departureVal);
    }
  }

  ngOnChanges(): void {
    if(this.routeInfo){
      let destinationVal = this.routeForm.value.destination!;
      let departureVal = this.routeForm.value.departure!;
      this.mapEstimationService.search(destinationVal).subscribe(destinationLocation =>{
        this.mapEstimationService.search(departureVal).subscribe(departureLocation =>{
            let createRide = this.createRideDTO(destinationLocation[0], departureLocation[0]);
            this.mapEstimationService.getEstimation(createRide).subscribe(result =>{
              this.estimation = result;
            });
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
    return { 
          "locations": [
            {
              "departure": {
                "address": this.routeForm.value.departure!,
                "latitude": departureLocation.lat,
                "longitude": departureLocation.lon
              },
              "destination": {
                "address": this.routeForm.value.destination!,
                "latitude": destinationLocation.lat,
                "longitude": destinationLocation.lon
              }
            }
          ],
          "vehicleType": this.routeForm.value.selectVehicleType!,
          "babyTransport": this.routeForm.controls["babyTransport"].value!,
          "petTransport": this.routeForm.controls["petTransport"].value!,
          "routeLength": this.routeInfo?.routeLength!
        }
  }

}


