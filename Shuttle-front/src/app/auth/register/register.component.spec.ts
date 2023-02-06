import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/infrastructure/material.module';
import { Observable, of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { HttpEvent } from '@angular/common/http';
import { RegisterService, PassengerDTO } from './register.service';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let registerServiceSpy: jasmine.SpyObj<RegisterService>;


    beforeEach(async () => {
        registerServiceSpy = jasmine.createSpyObj<RegisterService>(['submit']);
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                MaterialModule,
                BrowserAnimationsModule,
            ],
            providers: [
                {
                    provide: RegisterService,
                    useValue: registerServiceSpy
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function setFormData(
        email: string,
        password: string,
        confirmPassword: string,
        address: string,
        telephoneNumber: string,
        name: string,
        surname: string,
        profilePicture: string = ""): void {
        component.registerForm.get("email")?.setValue(email);
        component.registerForm.get("password")?.setValue(password);
        component.registerForm.get("confirmPassword")?.setValue(confirmPassword);
        component.registerForm.get("address")?.setValue(address);
        component.registerForm.get("telephoneNumber")?.setValue(telephoneNumber);
        component.registerForm.get("name")?.setValue(name);
        component.registerForm.get("surname")?.setValue(surname);
        component.registerForm.get("profilePicture")?.setValue(profilePicture);
    }

    function resetForm(): void{
        setFormData("", "", "", "", "", "", "");
    }

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should succeed', () => {
        expect(true).toBeTruthy();
    });

    it('should properly initiate form state', () => {
        expect(component.email.value).toEqual('');
        expect(component.password.value).toEqual('');
        expect(component.confirmPassword.value).toEqual('');
        expect(component.name.value).toEqual('');
        expect(component.surname.value).toEqual('');
        expect(component.telephoneNumber.value).toEqual('');
        expect(component.address.value).toEqual('');
        expect(component.profilePicture.value).toEqual('');

        expect(component.registerForm).toBeDefined();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('should not accept empty inputs', () => {

        // setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "12312312", "pera", "peric", "");
        setFormData("", "Troytroy123", "Troytroy123", "sdqwdq", "12312312", "pera", "peric");
        fixture.detectChanges();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "", "Troytroy123", "sdqwdq", "12312312", "pera", "peric");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "", "sdqwdq", "12312312", "pera", "peric");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "", "12312312", "pera", "peric");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "", "pera", "peric");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "12312312", "", "peric");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "12312312", "pera", "");
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

    });

    it('should make form valid for valid data', () => {

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "12312312", "pera", "peric");
        fixture.detectChanges();
        expect(component.registerForm.valid).toBeTrue();
        resetForm();
    });

    it('should make error when passwords dont match', () => {
        setFormData("pera@gmail.com", "Troytroy123", "dadw", "sdqwdq", "12312312", "pera", "peric");
        fixture.detectChanges();
        expect(component.registerForm.hasError("mismatch")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();
    });

    it('should make error when telephone number doesn\'t match regex', () => {
        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "adqwdqwd", "pera", "peric");
        fixture.detectChanges();
        expect(component.telephoneNumber.hasError("pattern")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();


        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "a231231241", "pera", "peric");
        fixture.detectChanges();
        expect(component.telephoneNumber.hasError("pattern")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "231231241a", "pera", "peric");
        fixture.detectChanges();
        expect(component.telephoneNumber.hasError("pattern")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "231231241a", "pera", "peric");
        fixture.detectChanges();
        expect(component.telephoneNumber.hasError("pattern")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();
    });

    it('should make error when email doesn\'t match regex', () => {
        setFormData(".peragmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "2131413", "pera", "peric");
        fixture.detectChanges();
        expect(component.email.hasError("email")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();


        let testEmail = "a@";
        for(let i = 0; i < 257; ++i){
            testEmail += "a";
        }
        setFormData(testEmail, "Troytroy123", "Troytroy123", "sdqwdq", "a231231241", "pera", "peric");
        fixture.detectChanges();
        expect(component.email.hasError("email")).toBeTrue();
        expect(component.registerForm.valid).toBeFalse();
        resetForm();

    });

    it('should not make error when telephone number matches regex', () => {

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "231231241", "pera", "peric");
        fixture.detectChanges();
        expect(component.registerForm.valid).toBeTrue();
        resetForm();

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "+231231241", "pera", "peric");
        fixture.detectChanges();
        expect(component.registerForm.valid).toBeTrue();
        resetForm();
    });

    it('should call submit clicked on button', (done) => {
        registerServiceSpy.submit.and.returnValue(of({} as HttpEvent<PassengerDTO>));

        setFormData("pera@gmail.com", "Troytroy123", "Troytroy123", "sdqwdq", "+231231241", "pera", "peric");
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("button[type='submit']"));
        button.nativeElement.click();

        fixture.whenStable().then(() => {
            expect(registerServiceSpy.submit).toHaveBeenCalled();
            done();
        });
    });





});
