import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';
import { AuthService } from '../../services/auth.service';
import { IRegisterRequest } from '../../types/registerRequest.interface';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  errorMessage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}

  onSubmit(): void {
    this.authService.register(this.form.value as IRegisterRequest).subscribe({
      next: (currentUser) => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser.token);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err);
        this.errorMessage = err.error.join(', ');
      }
    });
    console.log('onSubmit', this.form.value);
  }
}
