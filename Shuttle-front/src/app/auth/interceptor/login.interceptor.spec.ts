import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoginInterceptor } from './login.interceptor';

describe('LoginInterceptor', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            LoginInterceptor
        ],
        imports: [
            HttpClientTestingModule
        ]
    }));

    it('should be created', () => {
        const interceptor: LoginInterceptor = TestBed.inject(LoginInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
