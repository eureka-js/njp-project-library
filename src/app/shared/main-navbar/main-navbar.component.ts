import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.css'
})
export class MainNavbarComponent {
  isUserAdmin: boolean = false;
  isUserAdminSub!: Subscription;
  currPathUrl: string = "";

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
    this.isUserAdminSub = this.authService.getIsUserAdminSubject()
      .subscribe((res: boolean) => this.isUserAdmin = res);

    this.currPathUrl = this.router.url;
  }

  ngOnDestroy() {
    this.isUserAdminSub.unsubscribe();
  }
  
  onLogout() {
    this.authService.logout();
  }
}
