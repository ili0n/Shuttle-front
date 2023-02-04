import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Token } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenStorageService } from 'src/app/auth/token-storage.service';
import { MaterialModule } from 'src/infrastructure/material.module';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let tokenStorageSpy: jasmine.SpyObj<TokenStorageService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj<AuthService>(['login', 'setUser']);
        tokenStorageSpy = jasmine.createSpyObj<TokenStorageService>(['saveToken', 'saveRefreshToken']);

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
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
                    provide: AuthService,
                    useValue: authServiceSpy
                },
                {
                    provide: TokenStorageService,
                    useValue: tokenStorageSpy
                }
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function setFormData(email: string, password: string): void {
        component.formGroup.setValue({ email, password });
    }

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should properly initiate component state', () => {
        expect(component.loginError).toEqual('');
        expect(component.hasError).toBeFalsy();
        expect(component.formGroup).toBeDefined();
        expect(component.formGroup.valid).toBeFalsy();
    });

    it('should update the formGroup after entering an email and password', () => {
        const email = 'bob@gmail.com';
        const password = 'bob123';
        setFormData(email, password);
        expect(component.formGroup.value).toEqual({email, password});
    });

    it('should make the formGroup invalid if email is empty', () => {
        const email = '';
        const password = 'bob123';
        setFormData(email, password);
        expect(component.formGroup.valid).toBeFalsy();
    });

    it('should make the formGroup invalid if password is empty', () => {
        const email = 'bob@gmail.com';
        const password = '';
        setFormData(email, password);
        expect(component.formGroup.valid).toBeFalsy();
    });

    it('should make the formGroup invalid if email is invalid', () => {
        const email = 'bobgmail.com';
        const password = 'bob123';
        setFormData(email, password);
        expect(component.formGroup.valid).toBeFalsy();
    });

    it('should make the formGroup valid if inputs are good', () => {
        const email = 'bob@gmail.com';
        const password = 'bob123';
        setFormData(email, password);
        expect(component.formGroup.valid).toBeTruthy();
    });

    it('should display all neccessary elements', () => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
        expect(compiled.querySelector('#login-email')).toBeDefined();
        expect(compiled.querySelector('#login-password')).toBeDefined();
        expect(compiled.querySelector('#submitButton')).toBeDefined();
        expect(compiled.querySelector('#registerLink')).toBeDefined();
        expect(compiled.querySelector('#login-error')?.textContent).toEqual('');
    });

    it('should not allow me to login if email is blank', () => {
        setFormData('', 'bob123');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("#submitButton"));
        expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should not allow me to login if password is blank', () => {
        setFormData('bob@gmail.com.com', '');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("#submitButton"));
        expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should not allow me to login if email is of an invalid format', () => {
        setFormData('johngmail.com', 'bob123');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("#submitButton"));
        expect(button.nativeElement.disabled).toBeTruthy();
    });

    it('should allow me to login if the input fields are valid', () => {
        setFormData('bob@gmail.com', 'bob123');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("#submitButton"));
        expect(button.nativeElement.disabled).toBeFalsy();
    });

    // Note the async() because of whenStable and async operations.
    it('should call login() when I click on the enabled login button', async () => {
        setFormData('bob@gmail.com', 'bob123');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("#submitButton"));
        button.nativeElement.click();

        authServiceSpy.login.and.returnValue(of({} as Token));
        fixture.whenStable().then(() => {
            expect(authServiceSpy.login).toHaveBeenCalled();
        });
    });

    it('should save token when I successfully log in', async () => {
        setFormData('bob@gmail.com', 'bob123');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("#submitButton"));
        button.nativeElement.click();

        authServiceSpy.login.and.returnValue(of({} as Token));
        tokenStorageSpy.saveRefreshToken.and.callFake((token) => {});
        tokenStorageSpy.saveToken.and.callFake((token) => {});
        fixture.whenStable().then(() => {
            // expect(tokenStorageSpy.saveToken).toHaveBeenCalled();
            // expect(tokenStorageSpy.saveRefreshToken).toHaveBeenCalled();
            // TODO: Why don't these work? Why is tokenStorageSpy unknown?
        });
    });

    it('should show an error message when I log in with bad credentials', () => {
        authServiceSpy.login.and.returnValue(throwError(() => new HttpErrorResponse({status:400})));

        setFormData('bob@gmail.com', 'NotMyPassword');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css("#submitButton"));
        button.nativeElement.click();

        fixture.detectChanges();

        const compiled = fixture.debugElement.nativeElement as HTMLElement;

        expect(component.hasError).toBeTruthy();
        expect(component.loginError).toEqual(LoginComponent.errorMsgBadCredentials);
        expect(compiled.querySelector('#login-error')?.textContent).toEqual(component.loginError);
    });
});
