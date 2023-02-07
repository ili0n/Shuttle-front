import { TestBed } from '@angular/core/testing';

import { REFRESHTOKEN_KEY, TokenStorageService, TOKEN_KEY } from './token-storage.service';

describe('TokenStorageService', () => {
    let service: TokenStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TokenStorageService);
    });

    afterEach(() => {

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should [set] the new access token', () => {
        spyOn(Storage.prototype, 'setItem');
        spyOn(Storage.prototype, 'removeItem');
        spyOn(Storage.prototype, 'getItem');

        service.saveToken("ABCD");
        expect(Storage.prototype.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(TOKEN_KEY, "ABCD");
    });

    it('should [set] the new refresh token', () => {
        spyOn(Storage.prototype, 'setItem');
        spyOn(Storage.prototype, 'removeItem');
        spyOn(Storage.prototype, 'getItem');

        service.saveRefreshToken("ABCD");
        expect(Storage.prototype.removeItem).toHaveBeenCalledWith(REFRESHTOKEN_KEY);
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(REFRESHTOKEN_KEY, "ABCD");
    });

    it('should [fetch] the access token from localstorage', () => {
        spyOn(Storage.prototype, 'setItem');
        spyOn(Storage.prototype, 'removeItem');
        spyOn(Storage.prototype, 'getItem');

        const token = service.getToken();
        expect(Storage.prototype.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should [fetch] the refresh token from localstorage', () => {
        spyOn(Storage.prototype, 'setItem');
        spyOn(Storage.prototype, 'removeItem');
        spyOn(Storage.prototype, 'getItem');

        const token = service.getRefreshToken();
        expect(Storage.prototype.getItem).toHaveBeenCalledWith(REFRESHTOKEN_KEY);
    });
});
