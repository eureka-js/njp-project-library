import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  
  constructor(private userService: UserService) {};

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

  onRegister = () => {
      try {
          if (this.registerForm.value.password != this.registerForm.value.passRepeat) {
              throw new TypeError("Passwords must match");
          } else if (!new RegExp('^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$').test(this.registerForm.value.email)) {
              throw new TypeError("E-mail format is invalid");
          }

          this.userService.addUser(this.registerForm.value);
          this.message = "Register successful"
      } catch(e) {
          if (e instanceof TypeError) {
              this.message = e.message;
          } else {
              console.error(e);
          }
      }
  };
}
