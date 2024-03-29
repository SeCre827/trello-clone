import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { ICurrentUser } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environment';
import { IRegisterRequest } from '../types/registerRequest.interface';
import { ILoginRequest } from '../types/loginRequest.interface';
import { SocketService } from 'src/app/shared/services/socket.service';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<ICurrentUser | null | undefined>(
    undefined
  );

  isLoggenIn$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean)
  );
  constructor(private http: HttpClient, private socketService: SocketService) {}
  getCurrentUser(): Observable<ICurrentUser> {
    const url = enviroment.apiUrl + '/user';
    return this.http.get<ICurrentUser>(url);
  }

  register(registerRequestBody: IRegisterRequest): Observable<ICurrentUser> {
    const url = enviroment.apiUrl + '/users';
    return this.http.post<ICurrentUser>(url, registerRequestBody);
  }

  login(RequestBody: ILoginRequest): Observable<ICurrentUser> {
    const url = enviroment.apiUrl + '/users/login';
    return this.http.post<ICurrentUser>(url, RequestBody);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.socketService.disconnect();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setCurrentUser(currentUser: ICurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }
}
