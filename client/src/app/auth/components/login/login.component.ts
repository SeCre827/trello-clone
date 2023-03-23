import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ILoginRequest } from '../../types/loginRequest.interface';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.form.value as ILoginRequest).subscribe({
      next: (currentUser) => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser.token);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage =null;
        this.router.navigateByUrl('/')
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err);
        this.errorMessage = err.error.emailOrPassword
      }
    });
    console.log('onSubmit', this.form.value);
  }
}