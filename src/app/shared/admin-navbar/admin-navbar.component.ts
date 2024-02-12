import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  currPathUrl: string = "";

  constructor(private router: Router) {};

  ngOnInit() {
    this.currPathUrl = this.router.url;
  }
}
