import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

describe('AuthService', () => {
    let service: AuthService | null;

    beforeEach(() => {
        // httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
        // userServiceSpy = jasmine.createSpyObj('UserService', ['setInactive']);
        // sharedServiceSpy = jasmine.createSpyObj('SharedService', ['showSnackBar']);
        // tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['getToken']);

        // service = new AuthService(httpSpy, userServiceSpy, sharedServiceSpy, tokenStorageSpy);
        //service = null;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should give me a valid token when I log in with good credentials', () => {
        const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
        httpSpy.post.and.returnValue();
        const userServiceSpy = jasmine.createSpyObj('UserService', ['setInactive']);
        const sharedServiceSpy = jasmine.createSpyObj('SharedService', ['showSnackBar']);
        const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['getToken']);
        service = new AuthService(httpSpy, userServiceSpy, sharedServiceSpy, tokenStorageSpy);

    });
});
