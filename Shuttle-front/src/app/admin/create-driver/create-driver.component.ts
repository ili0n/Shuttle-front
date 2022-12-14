import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface VehicleType {
    name: string,
    pricePerKm: number,
};

@Component({
    selector: 'app-create-driver',
    templateUrl: './create-driver.component.html',
    styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent implements OnInit, OnDestroy {
    vehicleTypes: Array<VehicleType> = [];
    seatsPossible: Array<Number> = [1, 2, 3, 4, 5, 6, 7, 8];
    formGroup: FormGroup;

    ngOnInit(): void {
        document.body.className = "body-gradient1"; // Defined in src/styles.css

        this.vehicleTypes = [
            {name: 'Standard', pricePerKm: 20},
            {name: 'Luxury', pricePerKm: 80},
            {name: 'Van', pricePerKm: 40},
        ];
    }

    ngOnDestroy() {
        document.body.className = "";
    }

    constructor(private readonly formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({
            name: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')]],
            address: ['', [Validators.required]],
            profilePicture: [],

            vehicleModel: ['', [Validators.required]],
            vehicleType: ['', [Validators.required]],
            vehicleRegtable: ['', [Validators.required]],
            vehicleSeats: ['', [Validators.required]],
            vehicleBabies: [false],
            vehiclePets: [false],
        });
    }

    createDriver(): void {
        if (this.formGroup.valid) {
            //let result = this.formGroup.value + this.vehicleSeats;
            let result = this.formGroup.value;
            //result['vehicleSeats'] = this.vehicleSeats;
            console.log(result);
        }
    }
}
