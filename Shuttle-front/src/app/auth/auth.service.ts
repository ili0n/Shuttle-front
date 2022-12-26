import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Token} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        skip: 'true',
    });

    user$ = new BehaviorSubject(null);
    userState$ = this.user$.asObservable();

    constructor(private http: HttpClient) {
        this.user$.next(this.getRole());
    }

    login(auth: any): Observable<Token> {
        return this.http.post<Token>(environment.serverOrigin + 'api/user/login', auth, {
            headers: this.headers,
        });
    }

    logout() {
        localStorage.clear();
        window.location.reload();
    }

    getRole(): any {
        if (this.isLoggedIn()) {
            const accessToken: any = localStorage.getItem('user');
            const helper = new JwtHelperService();
            return helper.decodeToken(accessToken).role[0].name;
        }
        return null;
    }

    getUserId(): number {
        if (this.isLoggedIn()) {
            console.log("getUserId(): " + new JwtHelperService().decodeToken(localStorage.getItem('user')!).id);
            return new JwtHelperService().decodeToken(localStorage.getItem('user')!).id;
        }
        return -1;
    }

    getRoles(): string[] {
        if (this.isLoggedIn()) {
            const accessToken: any = localStorage.getItem('user');
            const helper = new JwtHelperService();
            const roles: any[] = helper.decodeToken(accessToken).role;
            return roles.map(r => r.name);
        }
        return [];
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('user') != null;

    }

    setUser(): void {
        this.user$.next(this.getRole());
    }
}
