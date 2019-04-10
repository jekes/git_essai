import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


import { Storage } from '@ionic/storage';
import { AuthentificationService } from '../providers/authentification/authentification.service';



@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {

  constructor(
    private router: Router,
    private login: AuthentificationService,
    public storage: Storage) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('UtilisateurActuel').then((val2) => {
          if (val2 && val2.token) {
            resolve(true);
          } else {
            this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
            resolve(false);
          }
        });
      });
    });

  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      // if not authorized, show access denied message
      this.router.navigate(['/home']);
    }
    return isAuthorized;

  }

  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page

    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    // get token from local storage or state management
    // const token = localStorage.getItem('token');

    // // decode token to read the payload details
    // const decodeToken = this.jwtHelperService.decodeToken(token);

    // // check if it was decoded successfully, if not the token is not valid, deny access
    // if (!decodeToken) {
    //   console.log('Invalid token');
    //   return false;
    // }

    // // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    // this.login.getRoles.subscribe(_ => {
    //   if (this.login.hasRoles(allowedRoles)) {
    //     // this.viewContainer.createEmbeddedView(this.templateRef);
    //     return true;
    //   } else {
    //     // this.viewContainer.clear();
    //     return false;
    //   }
    // });
  }
}
