import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedInEmmiter$ = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {};

  ngOnInit() {
    this.authService.authChange.subscribe((res) => this.isLoggedInEmmiter$.next(res));
  }
};
