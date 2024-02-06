import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errMessage: string = "";
  loginForm!: FormGroup;

  constructor(private auth: AuthService) {};

  ngOnInit() {
    this.auth.errEmmitter.subscribe((err: string) => this.errMessage = err);

    this.loginForm = new FormGroup({
      "username": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required])
    });
  }

  onLogin() {
    this.auth.login(this.loginForm.value);
  }
}
