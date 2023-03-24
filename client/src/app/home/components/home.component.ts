import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedInSub: Subscription | undefined;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.isLoggedInSub = this.authService.isLoggenIn$.subscribe(
      (isLoggenIn) => {
        if (isLoggenIn) {
          this.router.navigateByUrl('/boards');
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.isLoggedInSub) {
      this.isLoggedInSub.unsubscribe();
    }
  }
}
