import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../auth.service";
import {TokenStorageService} from "../../../token-storage.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    protected loginError: string = "";

    formGroup: FormGroup;
    hasError: boolean = false;

    onLoginSubmit(): void {
        if (this.formGroup.valid) {
            //console.log(this.formGroup.getRawValue());
            this.authService.login(this.formGroup.getRawValue()).subscribe({
                next: (result) => {
                    // @ts-ignore
                    //console.log(JSON.stringify(result['accessToken']));
                    // @ts-ignore
                    this.tokenStorage.saveToken(JSON.stringify(result['accessToken']));
                    // @ts-ignore
                    this.tokenStorage.saveRefreshToken(JSON.stringify(result['refreshToken']));
                    this.authService.setUser();
                    let homeRoute = this.authService.getRole() + '/home';
                    this.router.navigate([homeRoute]);
                    this.loginError = "";
                },
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        this.hasError = true;
                        if ((error as HttpErrorResponse).status == 400) {
                            this.loginError = "Wrong username or password!";
                        }
                    }
                },
            });
        }
    }

    constructor(private readonly formBuilder: FormBuilder, private authService: AuthService, private router: Router,
                private tokenStorage: TokenStorageService) {
        this.formGroup = formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        // HACK: Is there a better way to dynamically change body style from a component?
        document.body.className = "body-gradient1"; // Defined in src/styles.css
    }

    ngOnDestroy() {
        document.body.className = "";
    }
}
