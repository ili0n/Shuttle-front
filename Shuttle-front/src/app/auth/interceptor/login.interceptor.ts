import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {TokenStorageService} from "../token-storage.service";
import {AuthService} from "../auth.service";


@Injectable()
export class LoginInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private tokenService: TokenStorageService, private authService: AuthService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const accessToken: any = this.tokenService.getToken();
        // const decodedItem = JSON.parse(accessToken);
        if (req.headers.get('skip')) return next.handle(req);

        if (accessToken) {

            const cloned = req.clone({
                setHeaders: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(accessToken)
            // @ts-ignore
            return next.handle(cloned).pipe(catchError(error => {
                if (error instanceof HttpErrorResponse && !cloned.url.includes('login') && error.status === 401) {
                    return this.handle401Error(cloned, next);
                }
                return throwError(error);
            }));
        } else {
            return next.handle(req);
        }
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = this.tokenService.getRefreshToken();

            if (token)
                return this.authService.refreshToken(token).pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;

                        this.tokenService.saveToken(token.accessToken);
                        this.refreshTokenSubject.next(token.accessToken);

                        return next.handle(this.addTokenHeader(request, token.accessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;

                        this.authService.logout();
                        return throwError(err);
                    })
                );
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        /* for Spring Boot back-end */
        // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

        /* for Node.js Express back-end */
        return request.clone({
            setHeaders: {Authorization: `Bearer ${token}`}
        });
    }
}

