import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message: string = "";
  loginForm!: FormGroup;
  errEmmiterSub?: Subscription;
  userSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {};

  ngOnInit() {
    this.errEmmiterSub = this.authService.errEmmitter.subscribe((err: string) => this.message = err);

    this.loginForm = new FormGroup({
      "username": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required])
    });
  }

  ngOnDestroy() {
    this.errEmmiterSub?.unsubscribe();
  }

  onLogin() {
    this.authService.login(this.loginForm.value, "/");
  }
}
