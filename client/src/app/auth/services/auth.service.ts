import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICurrentUser } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environment';
import { IRegisterRequest } from '../types/registerRequest.interface';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<ICurrentUser | null | undefined>(
    undefined
  );
  constructor(private http: HttpClient) {}
  getCurrentUser(): Observable<ICurrentUser> {
    const url = enviroment.apiUrl + '/user';
    console.log(url);
    return this.http.get<ICurrentUser>(url);
  }

  register(registerRequestBody: IRegisterRequest): Observable<ICurrentUser> {
    const url = enviroment.apiUrl + '/users';
    return this.http.post<ICurrentUser>(url, registerRequestBody);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setCurrentUser(currentUser: ICurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }
}
