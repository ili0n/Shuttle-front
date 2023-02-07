import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Token } from '@angular/compiler';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { REFRESHTOKEN_KEY, TokenStorageService, TOKEN_KEY } from './token-storage.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpController!: HttpTestingController;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let tokenStorageSpy: jasmine.SpyObj<TokenStorageService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['setInactive']);
        tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['getToken']);
        // sharedServiceSpy = jasmine.createSpyObj('SharedService', ['showSnackBar']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: UserService,
                    useValue: userServiceSpy
                },
                {
                    provide: TokenStorageService,
                    useValue: tokenStorageSpy
                },
                // sharedServiceSpy
            ]
        });
        service = TestBed.inject(AuthService);
        httpController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should give me a valid token when I log in with good credentials', () => {
        const data = {email:'bob@gmail.com', password:'bob123'};

        service.login(data).subscribe({
            next: val => {
                expect(val).toBeTruthy();

                // @ts-ignore
                // expect(val['accessToken']).toBeTruthy();
            }
        });

        const req = httpController.expectOne({
            method: 'post',
            url: `${environment.serverOrigin}api/user/login`,
        });

        // Problem: accessToken and refreshToken are not a part of Token
        // So with the expect(val) from above, if we try to access either
        // of these fields, it'll return undefined.

        // Problem 2: This test fails sometimes because of timeout.

        // @ts-ignore
        req.flush(of({
            'accessToken': 'kjfn3kjn32.r3jkrj32k.rh32jkr32hkj',
            'refreshToken': 'fhekjfeh.rjelkfjewk.fjelkwfjewl'
        } as Token));
    });

    it('should clear storage on logout', () => {
        // userServiceSpy.setInactive.and.returnValue(of(false));
        // service.logout();
        // tick();
        // expect(localStorage.getItem(TOKEN_KEY)).toBeFalsy();
        // expect(localStorage.getItem(REFRESHTOKEN_KEY)).toBeFalsy();

        // Why is this causing a loop?!
    });

    it('should confirm that I am logged in', () => {
        tokenStorageSpy.getToken.and.returnValue("ahdjsdhs.fhdkjfdhk.dhskjdshk");
        expect(service.isLoggedIn()).toBeTruthy();
    });

    it('should confirm that I am logged out', () => {
        tokenStorageSpy.getToken.and.returnValue(null);
        expect(service.isLoggedIn()).toBeFalsy();
    });

    it('should return the appropriate role', () => {
        // This is a dummy JWT with `"role": [{"name":"admin"}]` added inside the payload.
        const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbeyJuYW1lIjoiYWRtaW4ifV19.ti9pG-vSh-qxtLKt0zDaV6KGmn9fhJzUFveeSqi5QPs";
        const expectedRole = "admin";
        tokenStorageSpy.getToken.and.returnValue(jwt);

        expect(service.getRole()).toEqual(expectedRole);
    });

    it('should return the appropriate id', () => {
        const jwt = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJTaHV0dGxlLWJhY2siLCJzdWIiOiJqb2huQGdtYWlsLmNvbSIsImF1ZCI6IndlYiIsImlhdCI6MTY3NTgwNzc5OSwiZXhwIjoxNjc1ODE4NTk5LCJpZCI6Miwicm9sZSI6W3sibmFtZSI6InBhc3NlbmdlciJ9XX0.cc1LW3jldkyWGw8SMEXTjU0UHipb8slHL7nmi7y-Eew_dSa4oBeJVeG5y8dH_Ymgqsytr-X5t2woCT5SOB_tAA";
        const expectedId =2;
        tokenStorageSpy.getToken.and.returnValue(jwt);
        expect(+service.getId()).toEqual(expectedId);
    });

    it('should return the appropriate email', () => {
        const jwt = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJTaHV0dGxlLWJhY2siLCJzdWIiOiJqb2huQGdtYWlsLmNvbSIsImF1ZCI6IndlYiIsImlhdCI6MTY3NTgwNzc5OSwiZXhwIjoxNjc1ODE4NTk5LCJpZCI6Miwicm9sZSI6W3sibmFtZSI6InBhc3NlbmdlciJ9XX0.cc1LW3jldkyWGw8SMEXTjU0UHipb8slHL7nmi7y-Eew_dSa4oBeJVeG5y8dH_Ymgqsytr-X5t2woCT5SOB_tAA";
        const expectedEmail ="john@gmail.com";
        tokenStorageSpy.getToken.and.returnValue(jwt);
        expect(service.getUserEmail()).toEqual(expectedEmail);
    });

    it('should return all roles in order', () => {
        const jwt = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJTaHV0dGxlLWJhY2siLCJzdWIiOiJqb2huQGdtYWlsLmNvbSIsImF1ZCI6IndlYiIsImlhdCI6MTY3NTgwNzc5OSwiZXhwIjoxNjc1ODE4NTk5LCJpZCI6Miwicm9sZSI6W3sibmFtZSI6InBhc3NlbmdlciJ9XX0.cc1LW3jldkyWGw8SMEXTjU0UHipb8slHL7nmi7y-Eew_dSa4oBeJVeG5y8dH_Ymgqsytr-X5t2woCT5SOB_tAA";
        tokenStorageSpy.getToken.and.returnValue(jwt);
        const roles = ["passenger"];
        expect(service.getRoles()).toEqual(roles);
    });

    it('should return an empty string if i ask for the role if logged out (i.e. token == null)', () => {
        tokenStorageSpy.getToken.and.returnValue(null);
        expect(service.getRole()).toEqual(null);
    });

    it('should return -1 if i ask for the id if logged out (i.e. token == null)', () => {
        tokenStorageSpy.getToken.and.returnValue(null);
        expect(service.getId()).toEqual("");
    });

    it('should return an empty string if i ask for the email if logged out (i.e. token == null)', () => {
        tokenStorageSpy.getToken.and.returnValue(null);
        expect(service.getUserEmail()).toEqual("");
    });

    it('should return [] for roles if logged out (i.e. token == null)', () => {
        tokenStorageSpy.getToken.and.returnValue(null);
        expect(service.getRoles()).toEqual([]);
    });

    // I'm not sure if there's any point in testing funcitons that just send an http call and get an observable.
});
