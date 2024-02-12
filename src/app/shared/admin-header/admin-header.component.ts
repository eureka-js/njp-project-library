import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  username?: string = "";
  usernameSub!: Subscription;

  constructor(private authService: AuthService) {};

  ngOnInit() {
    this.usernameSub = this.authService.getUserSubject()
      .subscribe((res) => this.username = res?.username);
  }

  ngOnDestory() {
    this.usernameSub.unsubscribe();
  }
}
