import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.css'
})
export class MainNavbarComponent {
  isUserAdmin: boolean = false;
  sub!: Subscription;

  constructor(private authService: AuthService) {};

  ngOnInit() {
    this.isUserAdmin = this.authService.isUserAdmin();
    this.sub = this.authService.getIsUserAdminSubject().subscribe((res) => this.isUserAdmin = res);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  onLogout() {
    this.authService.logout();
  }
};
