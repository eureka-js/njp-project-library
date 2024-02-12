import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  message: string = "";
  registerForm!: FormGroup;
  
  constructor(private userService: UserService, private router: Router) {};

  ngOnInit() {
    this.registerForm = new FormGroup({
      "username": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required]),
      "passRepeat": new FormControl(null, [Validators.required]),
      "name": new FormControl(null, [Validators.required]),
      "surname": new FormControl(null, [Validators.required]),
      "email": new FormControl(null, [Validators.required])
    });
  }

  onRegister() {
    if (this.registerForm.value.password != this.registerForm.value.passRepeat) {
      this.message = "Passwords must match";
    } else if (!new RegExp('^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$').test(this.registerForm.value.email)) {
      this.message = "E-mail format is invalid";
    } else {
      this.userService.addUser(new User(
        -1,
        this.registerForm.value.username,
        this.registerForm.value.name,
        this.registerForm.value.surname,
        this.registerForm.value.email,
        "",
        this.registerForm.value.password
      )).subscribe({
        next: () => this.message = "Register successful",
        error: (err) => {
          if (err instanceof TypeError) {
          this.message = err.message;
          } else {
            console.error(err);
          }
      }});
    }
  };
}
