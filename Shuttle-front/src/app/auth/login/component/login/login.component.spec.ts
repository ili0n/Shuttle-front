import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Token } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MaterialModule } from 'src/infrastructure/material.module';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                MaterialModule,
                BrowserAnimationsModule,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function setFormData(email: string, password: string): void {
        component.formGroup.setValue({ email, password });
    } 

    it('YESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS', () => {
        expect(true).toBeTruthy();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should properly initiate component state', () => {
        expect(component.loginError).toEqual('');
        expect(component.hasError).toBeFalsy();
        expect(component.formGroup).toBeDefined();
        expect(component.formGroup.valid).toBeFalsy();
    });

    it('should not display a login error initially', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('#login-error')?.textContent).toEqual('');
    });

    it('should let me click on login if the input fields are valid', () => {
        setFormData('bob@gmail.com', 'bob123');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("#submitButton"));
        expect(button.nativeElement.disabled).toBeFalsy();
    });

    it('should spy on authService', () => {
        // TODO: How to mock authService returning a Token instance with accessToken and refreshToken?

        const credentials = {
            'email': 'bob@gmail.com',
            'password': 'bob123'
        };
        const authService = fixture.debugElement.injector.get(AuthService);
        //let spy = spyOn(authService, 'login').and.returnValue(of({
        //    
        //}));
        fixture.detectChanges();
    });
});
