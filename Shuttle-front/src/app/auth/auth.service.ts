import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Token} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import { UserIdEmail, UserService } from '../user/user.service';
import { SharedService } from '../shared/shared.service';
import {TokenStorageService} from "./token-storage.service";

export interface PasswordCodeDTO {
	newPassword: string,
	code: string
}

export interface PasswordDTO {
	newPassword: string,
	oldPassword: string
}

export interface RoleDTO {
    id: number,
    name: string
}

export interface AuthDTO {
    username: string,
    password: string
}



@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        skip: 'true',
    });

    user$ = new BehaviorSubject<string | null>(null);
    userState$ = this.user$.asObservable();

    constructor(private http: HttpClient, private userService: UserService, private sharedService: SharedService,private tokenStorage: TokenStorageService) {
        this.user$.next(this.getRole());
    }

    login(auth: AuthDTO): Observable<Token> {
        return this.http.post<Token>(environment.serverOrigin + 'api/user/login', auth, {
            headers: this.headers,
        });
    }

    refreshToken(token: string) {
        return this.http.post(environment.serverOrigin + 'api/user/refreshtoken', {
            refreshToken: token
        }, {
            headers: this.headers,
        });
    }

    logout() {
        this.userService.setInactive(this.getUserId()).subscribe({
            next: (result) => {
                localStorage.clear();
                window.location.reload();
            },
            error: (error) => {
                console.error("Could not log out: " + error);
                this.sharedService.showSnackBar("Could not sign out.", 3000);
            }
        })
    }

    getRole(): string | null {
        if (this.isLoggedIn()) {
            const accessToken: string = this.tokenStorage.getToken()!;
            const helper = new JwtHelperService();
            return helper.decodeToken(accessToken!).role[0].name;
        }
        return null;
    }

    getUserId(): number {
        if (this.isLoggedIn()) {
            return new JwtHelperService().decodeToken(this.tokenStorage.getToken()!).id;
        }
        return -1;
    }

    getUserEmail(): string {
        if (this.isLoggedIn()) {
            //console.log(new JwtHelperService().decodeToken(localStorage.getItem('user')!));
            return new JwtHelperService().decodeToken(this.tokenStorage.getToken()!).sub;
        }
        return "";
    }

    getRoles(): string[] {
        if (this.isLoggedIn()) {
            const accessToken: string | null = this.tokenStorage.getToken();
            const helper = new JwtHelperService();
            const roles: RoleDTO[] = helper.decodeToken(accessToken!).role;
            return roles.map(r => r.name);
        }
        return [];
    }

    isLoggedIn(): boolean {
        return this.tokenStorage.getToken() != null;

    }

    setUser(): void {
        this.user$.next(this.getRole());
    }

    getId(): string {
        if (this.isLoggedIn()) {
            const accessToken: string | null = this.tokenStorage.getToken();
            const helper = new JwtHelperService();
            return helper.decodeToken(accessToken!).id;
        }
        return "";
    }

    getUserByEmail(email: string): Observable<UserIdEmail> {
        return this.http.get<UserIdEmail>(environment.serverOrigin + 'api/user/email', {
            params: {
                email: email
            },
            observe: 'body',
            responseType: 'json'
        });
    }

    sendCode(id: number){
        return this.http.get(environment.serverOrigin + `api/user/${id}` + "/resetPassword",{
        observe: 'body',
        responseType: 'json'
        });
    }

    resetPassword(passwordCode: PasswordCodeDTO, id: number){
        return this.http.put(environment.serverOrigin + `api/user/${id}` + "/resetPassword", passwordCode, {
        observe: 'body',
        responseType: 'json'
        });
    }

    changePassword(password: PasswordDTO, id: number){
        return this.http.put(environment.serverOrigin + `api/user/${id}` + "/changePassword", password, {
        observe: 'body',
        responseType: 'json'
        });
    }

}
