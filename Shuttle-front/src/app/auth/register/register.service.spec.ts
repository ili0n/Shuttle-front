import { TestBed } from '@angular/core/testing';

import { RegisterService } from './register.service';

describe('RegisterService', () => {
    let service: RegisterService;

    beforeEach(() => {
        const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
        service = new RegisterService(httpSpy);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
