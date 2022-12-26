import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ResolveEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isValidRoleFor(state.url);
    }

    /**
     * Check if the user can route to the desired location.
     * Note that the check is performed by comparing the first element in the url (`"/passenger/xyz/123" -> "passenger"`)
     * with the available roles in the session.
     * @param route Route
     * @param url Url that's being navigated to
     * @returns True if the user can route to the desired location, false otherwise.
     * If not logged in, the user is routed to /login. If not authorized, the user is routed to his home.
     */
    isValidRoleFor(url: string): boolean {
        if (this.authService.isLoggedIn()) {
            const role: string[] = this.authService.getRoles();
            const requiredRole: string = url.split('/')[1];

            console.log("Roles " + role + " required " + requiredRole);

            if (role.indexOf(requiredRole) != -1) {
                // Logged in and can access the route.
                return true;
            } else {
                // Logged in but cannot access this route with the given role(s).
                const homeRoute = this.authService.getRole() + '/home';
                this.router.navigate([homeRoute]);
                return false;
            }
        } else {
            // Not logged in, cannot proceed, send the user to the login page.
            this.router.navigate(['/login']);
            return false;
        }
    }

}
