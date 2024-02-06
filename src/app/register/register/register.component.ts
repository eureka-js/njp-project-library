import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  errMessage: string = "";
  registerForm!: FormGroup;
  
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
          if (this.registerForm.value.username == "") {
              throw new TypeError("Username must not be empty");
          } else if (this.registerForm.value.password == "") {
              throw new TypeError("Passwords must not be empty");
          } else if (this.registerForm.value.passRepeat == "") {
              throw new TypeError("Passwords must not be empty");
          } else if (this.registerForm.value.newUser.password != this.registerForm.value.passRepeat) {
              throw new TypeError("Passwords must match");
          } else if (this.registerForm.value.newUser.name == "") {
              throw new TypeError("Name must not be empty");
          } else if (this.registerForm.value.newUser.surname == "") {
              throw new TypeError("Surname must not be empty");
          } else if (this.registerForm.value.newUser.email == "") {
              throw new TypeError("E-mail must not be empty");
          } else if (!new RegExp('^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$').test(this.registerForm.value.email)) {
              throw new TypeError("E-mail format is invalid");
          }

          /*UserService.addUser(newUser).then(
              (response) => this.errMessage = response.message,
              (error) => this.errMessage = error
          );*/
      } catch(e) {
          if (e instanceof TypeError) {
              this.errMessage = e.message;
          } else {
              console.error(e);
          }
      }
  };
}
