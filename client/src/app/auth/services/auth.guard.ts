import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService.isLoggenIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) return true;
        this.router.navigateByUrl('/');
        return false;
      })
    );
  }
}
