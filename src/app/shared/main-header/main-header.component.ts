import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent {
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
