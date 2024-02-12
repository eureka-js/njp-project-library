import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currPathUrl: string = "";

  constructor(private router: Router) {};

  ngOnInit() {
    this.currPathUrl = this.router.url;
  }
};
