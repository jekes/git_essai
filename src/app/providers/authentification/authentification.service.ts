import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

const API_URL = environment.apiUrl_Auth;
// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };


@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  authSubject  =  new  BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.storage.get('UtilisateurActuel').then((val) => {
      if (val) { this.currentUserSubject.next(val); }
    });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getcurrentUserValue() {
    return this.authSubject;
  }


  login(nom_param, param): Observable<User> {
    const url = `${API_URL + '/' + nom_param}`;
    return this.http.post<User>(url, param).pipe(
      tap((user:  User ) => {

        if (user && user.token) {
          this.storage.set('UtilisateurActuel', user);
          this.currentUserSubject.next(user);
          this.authSubject.next(true);
        }
      })

    );
  }

  // login(nom_param, param) {
  //   const url = `${API_URL + '/' + nom_param}`;
  //   return this.http.post<User>(url, param)
  //     .pipe(map(user => {
  //       if (user && user.token) {
  //         console.log(user);
  //         this.storage.set('UtilisateurActuel', user);
  //         this.currentUserSubject.next(user);
  //       }
  //       return user;
  //     }));
  // }

  demo() {
    const user_demo = {
      username: 'demo',
      role: 'guest',
      success: 'OK',
      token: 'Demo-Token'
    };
    this.storage.set('UtilisateurActuel', user_demo);
    this.authSubject.next(true);
    this.currentUserSubject.next(user_demo);
  }

  signup(nom_param, param): Observable<any> {
    const url = `${API_URL + '/' + nom_param}`;
    return this.http.post(url, param)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    this.storage.remove('UtilisateurActuel');
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

