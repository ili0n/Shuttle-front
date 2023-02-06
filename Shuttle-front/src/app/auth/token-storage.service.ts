import { Injectable } from '@angular/core';


export const TOKEN_KEY = 'user-token';
export const REFRESHTOKEN_KEY = 'user-refreshtoken';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }


    public saveToken(token: string): void {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token.replaceAll("\\","").replaceAll("\"","").trim());
    }

    public getToken(): string | null {
        return window.localStorage.getItem(TOKEN_KEY);
    }

    public saveRefreshToken(token: string): void {
        window.localStorage.removeItem(REFRESHTOKEN_KEY);
        window.localStorage.setItem(REFRESHTOKEN_KEY, token.replaceAll("\\","").replaceAll("\"","").trim());
    }

    public getRefreshToken(): string | null {
        return window.localStorage.getItem(REFRESHTOKEN_KEY);
    }


}
